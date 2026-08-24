#!/usr/bin/env node
// Publish an over-the-air JS update to the self-hosted updates server.
//
//   npm run ota                        # export both platforms, publish to `production`
//   npm run ota -- --channel staging   # ...to a different channel
//   npm run ota -- --no-deploy         # build the payload locally, skip rsync
//
// Everything the server needs is generated here: the Metro bundle, the assets, and the
// manifest that expo-updates fetches. The VPS runs no application code — nginx serves
// static files (see deploy/nginx/ota.metis-iitgn.tech.conf), which is why the manifest
// is baked at publish time instead of being computed per request.
//
// Docs: docs/ota-updates.md · protocol: https://docs.expo.dev/technical-specs/expo-updates-1/

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '..');
const EXPORT_DIR = path.join(ROOT, '.ota-export'); // raw `expo export` output
const STAGE_DIR = path.join(ROOT, '.ota-publish'); // local mirror of the server's docroot

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
};

// --- args -------------------------------------------------------------------------

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};

const channel = opt('--channel', process.env.OTA_CHANNEL ?? 'production');
const platformArg = opt('--platform', 'all');
const platforms = platformArg === 'all' ? ['android', 'ios'] : [platformArg];
const deploy = !flag('--no-deploy');
const skipExport = flag('--skip-export');

for (const p of platforms) {
  if (p !== 'android' && p !== 'ios') die(`--platform must be android, ios or all (got "${p}")`);
}
if (!/^[A-Za-z0-9._-]{1,64}$/.test(channel)) die(`channel "${channel}" must match [A-Za-z0-9._-]{1,64}`);

// --- app config -------------------------------------------------------------------

// `expo config --type public` is exactly what a build embeds, so reading the update URL
// and version from it guarantees the manifest agrees with the shipped app.
const config = JSON.parse(
  execFileSync('npx', ['expo', 'config', '--type', 'public', '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'inherit'],
  })
);

const updateUrl = config.updates?.url;
if (!updateUrl) die('app.json has no expo.updates.url — nothing to publish against.');

// The manifest endpoint is <base>/manifest; assets hang off the same base.
const baseUrl = (process.env.OTA_BASE_URL ?? updateUrl.replace(/\/manifest\/?$/, '')).replace(/\/$/, '');
if (baseUrl === updateUrl) die(`expo.updates.url ("${updateUrl}") should end in /manifest`);

const runtimeVersion = resolveRuntimeVersion(config);

console.log(`▸ channel          ${channel}`);
console.log(`▸ runtime version  ${runtimeVersion}`);
console.log(`▸ base url         ${baseUrl}`);
console.log(`▸ platforms        ${platforms.join(', ')}`);

// --- export -----------------------------------------------------------------------

if (skipExport) {
  console.log('\n▸ reusing existing .ota-export (--skip-export)');
} else {
  console.log('\n▸ expo export');
  // Note: EXPO_PUBLIC_* variables from .env are inlined into this bundle.
  execFileSync(
    'npx',
    ['expo', 'export', '--output-dir', EXPORT_DIR, ...platforms.flatMap((p) => ['--platform', p])],
    { cwd: ROOT, stdio: 'inherit' }
  );
}

const metadata = readJson(path.join(EXPORT_DIR, 'metadata.json'));

// --- build the payload ------------------------------------------------------------

const blobsDir = path.join(STAGE_DIR, 'blobs');
fs.mkdirSync(blobsDir, { recursive: true });

const published = [];

for (const platform of platforms) {
  const fileMetadata = metadata.fileMetadata?.[platform];
  if (!fileMetadata) die(`metadata.json has no entry for ${platform} — re-run without --skip-export`);

  const launchAsset = stageAsset(fileMetadata.bundle, {
    contentType: 'application/javascript',
    // expo-updates only cares that the extension is stable; Hermes detects bytecode
    // from the file's magic header, not its name.
    fileExtension: '.bundle',
    gzip: true,
  });

  const assets = fileMetadata.assets.map((asset) =>
    stageAsset(asset.path, { fileExtension: `.${asset.ext}` })
  );

  // Derived from the payload rather than a timestamp, so an id identifies a specific set
  // of bytes. Note this is not reproducible across publishes: Hermes output for identical
  // source differs run to run, so re-publishing the same commit does mint a new id.
  const id = uuidFromHash(
    sha256Hex(
      [platform, runtimeVersion, launchAsset.hash, ...assets.map((a) => a.hash).sort()].join('|')
    )
  );

  const manifest = {
    id,
    createdAt: new Date().toISOString(),
    runtimeVersion,
    launchAsset,
    assets,
    metadata: {},
    // expo-constants reads Constants.expoConfig from here once an update is running.
    extra: { expoClient: config },
  };

  const manifestPath = path.join(STAGE_DIR, 'manifests', channel, runtimeVersion, `${platform}.json`);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));

  published.push({ platform, id, assetCount: assets.length, manifestPath });
}

console.log('');
for (const p of published) {
  console.log(`▸ ${p.platform.padEnd(8)} update ${p.id}  (${p.assetCount} assets)`);
}

// --- deploy -----------------------------------------------------------------------

const target = process.env.OTA_DEPLOY_TARGET;

if (!deploy || !target) {
  console.log(`\n▸ payload staged in ${path.relative(ROOT, STAGE_DIR)}/ — not uploaded.`);
  if (deploy && !target) {
    console.log('  Set OTA_DEPLOY_TARGET=user@host:/var/www/insiit-ota to rsync it automatically,');
    console.log('  or copy blobs/ first and manifests/ second by hand.');
  }
  process.exit(0);
}

// Blobs first, manifests second, always: a manifest must never reach the server before
// the files it points at, or a client can catch a half-published update.
console.log(`\n▸ rsync blobs → ${target}`);
rsync(`${blobsDir}/`, `${target.replace(/\/$/, '')}/blobs/`, ['--ignore-existing']);

console.log(`▸ rsync manifests → ${target}`);
rsync(`${path.join(STAGE_DIR, 'manifests')}/`, `${target.replace(/\/$/, '')}/manifests/`, []);

console.log('\n✔ published. Clients on runtime version ' + runtimeVersion + ' pick it up on next launch.');

// --- helpers ----------------------------------------------------------------------

function stageAsset(relPath, { contentType, fileExtension, gzip = false }) {
  const source = path.join(EXPORT_DIR, relPath);
  const bytes = fs.readFileSync(source);
  const digest = createHash('sha256').update(bytes).digest();
  const ext = fileExtension ?? path.extname(relPath);
  const blobName = `${digest.toString('hex')}${ext}`;
  const blobPath = path.join(blobsDir, blobName);

  if (!fs.existsSync(blobPath)) fs.writeFileSync(blobPath, bytes);
  // Precompressed sibling for nginx's gzip_static; harmless if the directive is off.
  if (gzip && !fs.existsSync(`${blobPath}.gz`)) {
    fs.writeFileSync(`${blobPath}.gz`, zlib.gzipSync(bytes, { level: 9 }));
  }

  return {
    hash: base64url(digest),
    key: createHash('md5').update(bytes).digest('hex'),
    fileExtension: ext,
    contentType: contentType ?? MIME[ext.toLowerCase()] ?? 'application/octet-stream',
    url: `${baseUrl}/blobs/${blobName}`,
  };
}

function resolveRuntimeVersion(cfg) {
  const rv = cfg.runtimeVersion;
  if (typeof rv === 'string') return rv;
  if (rv?.policy === 'appVersion') {
    if (!cfg.version) die('runtimeVersion policy is appVersion but expo.version is unset');
    return cfg.version;
  }
  die(
    `unsupported runtimeVersion ${JSON.stringify(rv)} — this script handles a literal string or ` +
      `the appVersion policy. See docs/ota-updates.md.`
  );
}

function rsync(from, to, extra) {
  execFileSync('rsync', ['-rlptz', '--human-readable', ...extra, from, to], { stdio: 'inherit' });
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex');
}

// Base64URL, unpadded — the encoding the updates protocol specifies for asset hashes.
function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// The protocol requires a UUID; taking the first 128 bits of a content hash keeps it
// deterministic. Same trick as Expo's reference server implementation.
function uuidFromHash(hex) {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

function die(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}
