# Over-the-air updates

The app ships with [`expo-updates`](https://docs.expo.dev/versions/v57.0.0/sdk/updates/),
so JavaScript-only fixes reach users without a Play Store review. On launch the app asks
`https://ota.metis-iitgn.tech/manifest` whether a newer bundle exists for its runtime
version, downloads it in the background, and runs it the **next** time the app is opened.
Nothing is shown to the user and nothing restarts mid-session.

Updates are hosted on our own VPS as **static files**. There is no application server:
`npm run ota` builds the bundle *and* the manifest on your machine and rsyncs them up, so
nginx only ever reads files off disk. That keeps the box idle between releases and means
the update server cannot break at runtime — if it 404s, clients keep running the bundle
baked into their APK.

## What can and cannot go out over the air

An update replaces the JS bundle and its assets (images, fonts). It **cannot** change
anything compiled into the APK:

| Over the air | Needs a new Play Store release |
| --- | --- |
| Screens, navigation, styling, business logic | Adding/removing/upgrading a native module |
| New images, fonts, other Metro assets | Anything in `app.json` that affects the native project — permissions, plugins, icons, splash |
| `EXPO_PUBLIC_*` values (they are inlined at bundle time) | Expo SDK or React Native upgrades |
| Reverting a bad JS change | `plugins/*` changes |

The guard rail is the **runtime version**. `app.json` sets
`"runtimeVersion": { "policy": "appVersion" }`, so a build's runtime version *is*
`expo.version` — `3.0.0` today — and the server keys manifests by it. A client only ever
sees updates published under its own runtime version.

> **The rule that keeps this safe:** bump `expo.version` in `app.json` in the same commit
> as any native change. A native change with the version left alone means the next
> `npm run ota` hands new JS to old builds that lack the native code it calls, and they
> crash on launch. Bumping the version leaves those old builds on the last update that
> matched them, which is exactly what you want.

## Publishing an update

```sh
# 1. Make sure .env holds the *production* values — EXPO_PUBLIC_* are inlined into the
#    bundle, so whatever is on your machine is what users get.
# 2. Publish:
npm run ota
```

That runs `scripts/publish-ota.mjs`, which:

1. reads `expo config --type public` (the same config a build embeds) for the update URL
   and the runtime version;
2. runs `npx expo export` into `.ota-export/` — never `dist/`, so your release APKs there
   survive;
3. hashes every file into `.ota-publish/blobs/<sha256>.<ext>` and writes
   `.ota-publish/manifests/<channel>/<runtime version>/<platform>.json`;
4. rsyncs **blobs first, manifests second** to `$OTA_DEPLOY_TARGET`.

The ordering matters: a manifest that arrives before the files it references would hand a
client a half-published update. Blobs are content-addressed, so uploads are incremental
(`--ignore-existing`) and two platforms sharing an asset store it once.

Set the deploy target once, in your shell profile or `.env.local`:

```sh
export OTA_DEPLOY_TARGET=deploy@ota.metis-iitgn.tech:/var/www/insiit-ota
```

Without it the script stages everything locally and tells you what to copy. Useful flags:

```sh
npm run ota -- --no-deploy               # build the payload, don't upload
npm run ota -- --skip-export             # reuse .ota-export/ (fast iteration on the script)
npm run ota -- --platform android        # one platform only
npm run ota -- --channel staging         # publish to a non-production channel
```

## Rolling back

Check out the last good commit and publish again:

```sh
git checkout <good-sha> && npm run ota && git checkout -
```

Rolling back does **not** un-launch the bad update on a phone that already applied it —
the user gets the rollback on their next launch after that, as a fresh download. (Hermes
does not compile identical source to identical bytes, so a re-published bundle is a new
update ID, not a cache hit on the old one. It also means every publish adds ~7 MB of
blobs to the server; see below.)

## Channels

The channel comes from `expo.updates.requestHeaders["expo-channel-name"]` in `app.json`
and is baked into the APK at build time — EAS Build would inject it automatically, but we
build locally, so it lives in the app config. Store builds are on `production`. To test an
update on a device without touching production, build with the header set to `staging`,
then `npm run ota -- --channel staging`.

## Server layout

```
/var/www/insiit-ota/
├── blobs/                                      # immutable, content-addressed
│   ├── 5778a722….bundle
│   ├── 5778a722….bundle.gz                     # precompressed for gzip_static
│   └── 8b61a4c7….png
└── manifests/
    └── production/
        └── 3.0.0/
            ├── android.json
            └── ios.json
```

nginx routes `GET /manifest` to a file using the request headers `expo-platform`,
`expo-runtime-version` and `expo-channel-name` — see the `map` blocks in
[`deploy/nginx/ota.metis-iitgn.tech.conf`](../deploy/nginx/ota.metis-iitgn.tech.conf).
Runtime version and channel are interpolated into a path, so they are whitelisted by
regex, not sanitised: anything with a slash in it fails the match and gets a 400.

Old blobs are never deleted, because old manifests still point at them. Assets dedupe
across publishes (they are content-addressed and Metro hashes them deterministically), but
each publish adds a fresh ~7 MB bundle per platform, so budget roughly 15 MB per release.
To reclaim space, delete `manifests/` entries for runtime versions nobody runs any more,
then any blob no remaining manifest references:

```sh
# on the VPS — dry run first, this is a delete
cd /var/www/insiit-ota
comm -23 <(ls blobs | grep -v '\.gz$' | sort) \
         <(cat manifests/*/*/*.json | grep -o '/blobs/[^"]*' | sed 's|/blobs/||' | sort -u)
```

## First-time setup

**On the VPS** — the header comments in
[`deploy/nginx/ota.metis-iitgn.tech.conf`](../deploy/nginx/ota.metis-iitgn.tech.conf) are
the install script: create `/var/www/insiit-ota`, symlink the config, point
`ota.metis-iitgn.tech` at the box, run certbot, reload nginx. Uncomment `gzip_static on;`
if `nginx -V 2>&1 | grep with-http_gzip_static_module` prints something — it cuts the
bundle download from 7 MB to 2.6 MB with no CPU cost at request time.

**In the app** — OTA only works for builds that contain `expo-updates`. The APKs already
in the wild (`versionCode 15`) do not, so the first Play Store release after this change
is what switches OTA on; every release after that can be patched over the air.

```sh
npx expo prebuild -p android   # regenerate android/ so the manifest picks up the config
./gradlew -p android bundleRelease
```

`android/` was already regenerated when OTA was set up. `ios/` was **not** — run
`npx expo prebuild -p ios && npx pod-install` before the next iOS build, or `Expo.plist`
will be missing `EXUpdatesURL` and that build will never check for updates.

Confirm it took effect before shipping — the update config lives in the built manifest:

```sh
grep -A1 EXPO_UPDATE_URL android/app/src/main/AndroidManifest.xml
```

## Debugging

`expo-updates` is inert in development (`expo start`, dev client) — it only runs in
release builds. To watch it work on a device:

```sh
adb logcat | grep -i expo-updates
```

Common outcomes:

- **`404` on the manifest** — nothing published for that runtime version and channel yet.
  Harmless: the app runs its embedded bundle. Check `manifests/<channel>/<version>/` on
  the server matches what the client asks for in the nginx access log.
- **Update downloads but never appears** — expected on the first launch; it applies on the
  next one, by design (`fallbackToCacheTimeout: 0`).
- **Nothing in the log at all** — the build predates `expo-updates`, or you are running a
  debug build.

## Not done yet: code signing

Updates are served over TLS but are not signed, so anyone who can write to
`/var/www/insiit-ota` can push arbitrary JS to every user. Worth closing with
`npx expo-updates codesigning:generate` — the private key stays on the publishing machine
(the manifests are generated there, not on the VPS), so a compromised VPS could then no
longer forge an update. Until then, treat write access to that directory as equivalent to
Play Store signing keys.
