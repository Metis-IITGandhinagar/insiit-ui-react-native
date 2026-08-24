# INSIIT

The campus app for IIT Gandhinagar, by [Metis](https://github.com/Metis-IITGandhinagar).
Mess menus and meal QR, bus schedules, timetable, campus map, outlets, lost & found,
buy/sell, cab sharing, events and announcements.

React Native + Expo SDK 57. Android is the supported target; the iOS project builds but
is untested.

**[Download the latest APK →](../../releases/latest)**

---

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Firebase setup (google-services.json + SHA-1)](#firebase-setup)
- [Google Sign-In web client ID](#google-sign-in-web-client-id)
- [Mapbox token](#mapbox-token)
- [Release signing keystore](#release-signing-keystore)
- [Running the app](#running-the-app)
- [Building a release APK](#building-a-release-apk)
- [Publishing a release](#publishing-a-release)
- [Over-the-air updates](#over-the-air-updates)
- [Project layout](#project-layout)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 20 LTS or newer | `node -v` |
| npm | 10+ | ships with Node |
| JDK | **17** | Android Gradle Plugin requires 17. Temurin 17 works. |
| Android Studio | Meerkat or newer | for the SDK, platform-tools and an emulator |
| Android SDK | Platform 36 + Build-Tools 36 | installed via Android Studio → SDK Manager |
| Xcode | 16+ | **iOS only**, macOS only |

Set `ANDROID_HOME` and put the platform tools on your `PATH` (add to `~/.zshrc`):

```sh
export ANDROID_HOME="$HOME/Library/Android/sdk"        # Linux: $HOME/Android/Sdk
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```

> **Expo Go will not work.** The app uses native modules (Firebase Auth, Google Sign-In,
> Mapbox, MMKV, Reanimated worklets). You need a development build — that is what
> `npx expo run:android` produces.

---

## Quick start

```sh
git clone https://github.com/Metis-IITGandhinagar/insiit-ui-react-native-new.git
cd insiit-ui-react-native-new
npm install

cp .env.example .env                  # then fill it in — see below
# drop your google-services.json at the repo root — see Firebase setup

npx expo prebuild --clean             # regenerates android/ and ios/
npx expo run:android                  # builds, installs and starts Metro
```

The two things you must supply yourself are **`.env`** and **`google-services.json`**.
Both are gitignored; neither is in this repo.

---

## Environment variables

Every environment-dependent constant lives in `.env`. Expo loads it automatically.
`.env.example` is the tracked template — copy it and fill in the blanks.

| Variable | Required | What it is |
| --- | --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | ✅ | Base URL of the INSIIT backend. No trailing slash. |
| `EXPO_PUBLIC_TIMETABLE_API_URL` | ✅ | Timetable scraper API, including its `/api` prefix. |
| `EXPO_PUBLIC_MESS_PORTAL_URL` | ✅ | Mess portal origin, scraped for the meal QR code. |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | ✅ | Google Sign-In OAuth **web** client ID. |
| `EXPO_PUBLIC_MAPBOX_TOKEN` | ➖ | Public `pk.*` Mapbox token. Blank ⇒ map screen shows a placeholder. |

Three rules worth internalising:

1. **Only `EXPO_PUBLIC_*` variables reach the app.** Anything else in `.env` is visible
   to the Expo CLI and build scripts only.
2. **They are inlined into the bundle at build time**, as plain text. Anyone who unzips
   the APK can read them, so *never* put a real secret in an `EXPO_PUBLIC_` variable.
   Secrets belong on the backend.
3. **Only dot notation is inlined.** `process.env.EXPO_PUBLIC_FOO` works;
   `process.env['EXPO_PUBLIC_FOO']` does not.

Because values are baked in at bundle time, editing `.env` while the dev server is
running changes nothing. Restart with a cleared cache:

```sh
npx expo start --clear
```

Machine-specific overrides go in `.env.local` (gitignored, takes precedence over `.env`).

If a required variable is missing the app throws at startup with the list of what's
missing, rather than failing later as a confusing network error. That check lives in
[`src/core/config/checkEnv.ts`](src/core/config/checkEnv.ts) and runs from `index.ts`
before anything else loads.

---

## Firebase setup

Auth is Firebase + Google Sign-In, restricted to `@iitgn.ac.in` accounts. You need your
own Firebase project to build (the Metis one is not shared).

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
2. **Build → Authentication → Sign-in method → Google → Enable.**
3. **Project settings → Your apps → Add app → Android.**
   - Android package name: **`com.metis.insiit`** — it must match `expo.android.package`
     in [`app.json`](app.json). If you change one, change the other.
4. Add your **SHA-1 certificate fingerprints** (see below). Google Sign-In fails with a
   bare `DEVELOPER_ERROR` / status code 10 if the fingerprint of the APK's signing key
   is not registered.
5. Download **`google-services.json`** and save it at the **repo root**.
   `google-services.example.json` shows the expected shape.

`google-services.json` is gitignored on purpose — it is per-project config, and pinning
one project's config in a public repo just breaks every fork.

### Getting your SHA-1 fingerprint

You need one fingerprint per keystore that will ever sign the app: your **debug**
keystore, your **release/upload** keystore, and — if you ship on Play — Google's
**app-signing** key.

**Debug keystore** (created automatically on first Android build):

```sh
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android -keypass android
```

**Release keystore:**

```sh
keytool -list -v -keystore /path/to/your-upload.jks -alias your-key-alias
```

Or ask Gradle for every variant at once:

```sh
cd android && ./gradlew signingReport
```

Copy the `SHA1: XX:XX:…` line into **Firebase → Project settings → Your apps → Android →
Add fingerprint**, then **re-download `google-services.json`** — adding a fingerprint
mints a new OAuth client, and the file you downloaded before won't contain it.

If you publish through Google Play with Play App Signing, also add the SHA-1 from
**Play Console → Release → Setup → App signing**. The APK users install is signed by
Google's key, not yours.

---

## Google Sign-In web client ID

`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` must be the **web** client ID, not the Android one.
Firebase exchanges the Google ID token server-side and only accepts the web client.

Find it either way:

- In `google-services.json`, under `client[].oauth_client[]`, take the entry with
  **`"client_type": 3`** — its `client_id` ends in `.apps.googleusercontent.com`.
- Or: Google Cloud console → **APIs & Services → Credentials → OAuth 2.0 Client IDs →
  "Web client (auto created by Google Service)"**.

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=000000000000-xxxxxxxx.apps.googleusercontent.com
```

Using the `"client_type": 1` (Android) ID instead produces a sign-in that appears to
succeed and then fails token exchange.

---

## Mapbox token

The campus map uses `@rnmapbox/maps`. Set `EXPO_PUBLIC_MAPBOX_TOKEN` to a **public**
access token from your [Mapbox account](https://account.mapbox.com/access-tokens/):

- It must start with **`pk.`**. A secret `sk.` token would be inlined into the APK in
  plain text and billed to your account by whoever extracts it.
- Default scopes (`styles:read`, `fonts:read`, `datasets:read`, `vision:read`) are enough.
- No build-time download token is needed; the `@rnmapbox/maps` config plugin treats
  Mapbox's Maven credentials as optional.

Leave it blank to skip Mapbox entirely — the map screen renders a "Map unavailable"
placeholder and everything else works.

---

## Release signing keystore

Debug builds fall back to the standard debug keystore, so a fresh clone builds with no
setup. **Release builds have no fallback on purpose** — an unsigned or debug-signed
release is worse than a failed build. See
[`plugins/withAndroidSigning.js`](plugins/withAndroidSigning.js), which patches the
signing config into the generated `android/app/build.gradle` at prebuild time.

Generate an upload keystore (keep it safe and out of the repo — `*.jks` is gitignored):

```sh
keytool -genkeypair -v \
  -keystore ~/keystores/insiit-upload.jks \
  -alias insiit-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Point Gradle at it from your **global** `~/.gradle/gradle.properties` (never the
in-repo one — that file is regenerated by `expo prebuild` and would leak passwords):

```properties
# Release signing — read by the INSIIT project only
INSIIT_STORE_FILE=/Users/you/keystores/insiit-upload.jks
INSIIT_KEY_ALIAS=insiit-upload
INSIIT_STORE_PASSWORD=your-store-password
INSIIT_KEY_PASSWORD=your-key-password

# Optional: override the debug keystore too
INSIIT_DEBUG_STORE_FILE=/Users/you/keystores/insiit-debug.keystore
INSIIT_DEBUG_KEY_ALIAS=insiit-debug
INSIIT_DEBUG_STORE_PASSWORD=android
INSIIT_DEBUG_KEY_PASSWORD=android
```

Remember to register the new keystore's SHA-1 in Firebase (see above), otherwise the
release build installs fine and then refuses to sign in.

> Losing this keystore means you can never update the app under the same Play listing.
> Back it up somewhere durable.

---

## Running the app

```sh
npx expo run:android          # debug build → installs on device/emulator, starts Metro
npx expo run:ios              # macOS only, untested
npm start                     # Metro only, against an already-installed dev build
```

`npx expo run:android` is only needed when native code changes (new native dependency,
`app.json` plugin change, first run). After that, `npm start` and reload is enough for
JS changes.

Regenerate the native projects after pulling changes that touch `app.json`, plugins or
native dependencies — `android/` and `ios/` are gitignored build output:

```sh
npx expo prebuild --clean
```

---

## Building a release APK

1. Make sure `.env` holds the values you want **shipped** — they are baked into the
   bundle. In particular use a `pk.*` Mapbox token, not `sk.*`.
2. Bump `expo.version` and `expo.android.versionCode` in [`app.json`](app.json).
   `versionCode` must be a strictly increasing integer.
3. Build:

```sh
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

Output: **`android/app/build/outputs/apk/release/app-release.apk`**

That APK is *universal* — it packs native libraries for all four ABIs and lands around
**186 MB**, most of it Mapbox. For a download link, build for 64-bit ARM only, which
covers essentially every Android phone from 2016 onward and cuts it to **~65 MB**:

```sh
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

Both write to the same path, so copy the artifact out before building the other one.

For a Play Store upload, build an App Bundle instead:

```sh
./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

Verify what you built before shipping it:

```sh
# signed by the right key?
$ANDROID_HOME/build-tools/36.0.0/apksigner verify --print-certs \
  android/app/build/outputs/apk/release/app-release.apk

# installs and runs?
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

---

## Publishing a release

```sh
VERSION=v3.0.0
mkdir -p dist                                  # dist/ is gitignored

./gradlew -p android assembleRelease -PreactNativeArchitectures=arm64-v8a
cp android/app/build/outputs/apk/release/app-release.apk dist/insiit-$VERSION-arm64-v8a.apk

gh release create "$VERSION" dist/insiit-$VERSION-*.apk \
  --title "INSIIT $VERSION" \
  --notes "What's new in this build…"
```

Attach the universal APK too if you want to cover 32-bit devices; label which is which
in the release notes so people pick the right one.

Or via the web UI: **Releases → Draft a new release → Choose a tag → attach the APK**.

Keep the tag in sync with `expo.version` in `app.json`. Users installing the APK
directly need "Install unknown apps" enabled for their browser or file manager.

---

## Over-the-air updates

JavaScript-only fixes can go out without a Play Store review. The app carries
`expo-updates` and checks our own VPS on launch:

```sh
npm run ota                 # export, build manifests, rsync to the update server
npm run ota -- --no-deploy  # build the payload locally without uploading
```

Two things to internalise before using it:

- **Only JS and assets travel this way.** Anything native — a new module, a permission, an
  `app.json` plugin, an SDK bump — still needs a store release.
- **Bump `expo.version` in `app.json` in the same commit as any native change.** The
  runtime version is derived from it (`runtimeVersion.policy: "appVersion"`), and it is
  what stops new JS from being handed to an old build that can't run it.

OTA starts working from the first store release built *after* this was added — the APKs
already out there (`versionCode 15`) have no updates client in them.

Full picture — server layout, nginx config, channels, rollback, debugging:
[`docs/ota-updates.md`](docs/ota-updates.md).

---

## Project layout

```
src/
  core/          app-wide infrastructure
    api/         axios client, backend time helpers
    auth/        Firebase + Google Sign-In
    config/      startup env validation
    context/     AuthProvider
    navigation/  RootNavigator — owns all headers and transitions
    theme/       colors, spacing, radius; light/dark
  features/      one folder per feature: screens/, components/, services/, hooks/
  shared/        cross-feature components
  constants/     static links (institute portals, mess forms)
  utils/
plugins/         Expo config plugins (Android release signing, iOS pod/scene tweaks)
scripts/         publish-ota.mjs — builds and uploads OTA updates
deploy/nginx/    server block for the OTA update host
docs/            ota-updates.md
assets/          icons, splash, fonts
```

Conventions and known rough edges are documented in [`notes.md`](notes.md).
`RootNavigator` owns headers and transitions — screens pass a `title` and nothing else.

---

## Troubleshooting

**`Missing environment variable(s): …` at startup**
`.env` is incomplete, or the bundle predates your edit. Fill it in and
`npx expo start --clear`.

**Google Sign-In fails with `DEVELOPER_ERROR` / status code 10**
The SHA-1 of the key that signed the installed APK is not registered in Firebase, or
`google-services.json` is stale. Add the fingerprint, re-download the file, rebuild.
Also confirm `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is the `client_type: 3` ID.

**`No matching client found for package name 'com.metis.insiit'`**
The Android app registered in your Firebase project uses a different package name than
`expo.android.package` in `app.json`.

**`[withAndroidSigning] Could not find the expected signingConfigs block`**
The Expo template's `build.gradle` changed. Update the marker strings in
`plugins/withAndroidSigning.js` to match the new template.

**Release build fails on signing / installs but is debug-signed**
The `INSIIT_STORE_FILE` family of Gradle properties is missing from
`~/.gradle/gradle.properties`.

**Map is blank or says "Map unavailable"**
No `EXPO_PUBLIC_MAPBOX_TOKEN`, or the token is invalid. Note `@rnmapbox/maps` is native:
a dev build made before it was added won't have it — re-run `npx expo prebuild` and
rebuild.

**A native module is `undefined` / "not found" after pulling**
New native dependency. `npm install && npx expo prebuild --clean && npx expo run:android`.

**Stale bundle, odd Metro errors**

```sh
npx expo start --clear
rm -rf node_modules && npm install
cd android && ./gradlew clean
```

---

## Contributing

Issues and pull requests welcome. Keep `.env`, `google-services.json` and any `*.jks`
out of your commits — they're gitignored; don't force-add them.

## License

See [LICENSE](LICENSE).
