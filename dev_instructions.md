# Running INSIIT locally

End-to-end setup for the INSIIT backend ([`insiit-backend-rust`](https://github.com/Metis-IITGandhinagar/insiit-backend-rust))
and app ([`insiit-ui-react-native-new`](https://github.com/Metis-IITGandhinagar/insiit-ui-react-native-new)),
from a clean machine to a running dev build.

## 0. Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 20 LTS+ |
| JDK | **17** (AGP requirement) |
| Android Studio | SDK Platform 36 + Build-Tools 36 |
| Rust | stable, current edition 2024 support |
| Docker | optional, for Postgres |

```sh
export ANDROID_HOME="$HOME/Library/Android/sdk"   # Linux: $HOME/Android/Sdk
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```

Expo Go will not work — the app uses native modules (Firebase Auth, Google Sign-In,
Mapbox, MMKV, Reanimated worklets). You need a development build.

## 1. Clone both repositories

```sh
git clone https://github.com/Metis-IITGandhinagar/insiit-backend-rust.git
git clone https://github.com/Metis-IITGandhinagar/insiit-ui-react-native-new.git
```

## 2. Create a Firebase project

Console → **Add project**. One project serves both the app (client auth) and the
backend (token verification).

## 3. Enable Google sign-in

**Build → Authentication → Sign-in method → Google → Enable.** Set a support email.

## 4. Register the Android app

**Project settings → Your apps → Add app → Android.** Package name must be exactly
`com.metis.insiit`, matching `expo.android.package` in `app.json`.

## 5. Set up the signing keystore

If someone hands you `upload-keystore.jks` and `keystore.properties`, drop both in the
repo root and skip to step 6 — that is the whole setup, on every OS. Both are gitignored,
so they have to be copied across out of band (not through the repo, not through a public
channel).

Starting fresh instead, create a **new, INSIIT-specific** keystore. Do not reuse one from
another project:

```sh
cd insiit-ui-react-native-new
keytool -genkeypair -v \
  -keystore upload-keystore.jks \
  -alias insiit-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

`*.jks` is gitignored, so the repo root is a safe place for it. **Back it up somewhere
durable** — losing it means you can never update the app under the same Play listing.

Record the credentials in `keystore.properties` at the repo root (also gitignored):

```sh
cp keystore.properties.example keystore.properties
```

```properties
INSIIT_KEY_ALIAS=insiit-upload
INSIIT_STORE_PASSWORD=your-store-password
INSIIT_KEY_PASSWORD=your-key-password
```

That is it — no `source`, no environment variables, nothing to re-run per shell. Gradle
reads the file itself, which is what makes this work the same on Windows as on macOS.

Each value resolves in this order, first hit wins:

1. a Gradle property — `-PINSIIT_…`, or `~/.gradle/gradle.properties`
2. `keystore.properties` at the repo root
3. `./upload-keystore.jks` at the repo root, else the template `debug.keystore`

`INSIIT_STORE_FILE` is optional: omitted, the root `upload-keystore.jks` is used. If you
do set it, a relative path resolves against the **repo root**, not `android/app/`.

[`plugins/withAndroidSigning.js`](plugins/withAndroidSigning.js) patches this into the
generated `android/app/build.gradle` at prebuild time. Debug builds use the same key
unless you set the `INSIIT_DEBUG_*` values, so there is a single SHA-1 to register.
Debug falls back to the template `debug.keystore` only when no credentials are found at
all; **release has no such fallback on purpose** — it fails rather than shipping a
debug-signed APK.

## 6. Register the keystore's SHA-1 in Firebase

```sh
keytool -list -v -keystore insiit-upload.jks -alias insiit-upload
```

Paste the `SHA1:` line into **Project settings → Your apps → Android → Add fingerprint**.
Google Sign-In fails with a bare `DEVELOPER_ERROR` / status code 10 if the fingerprint of
the key that signed the installed APK isn't registered.

Because debug and release use the same key, this one fingerprint covers both. If you
later ship through Play with Play App Signing, add the SHA-1 from **Play Console →
Release → Setup → App signing** as well — the APK users install is signed by Google's
key, not yours.

## 7. Download `google-services.json`

Download it **after** adding the fingerprint — adding one mints a new OAuth client, and
a file downloaded earlier won't contain it. Save at the frontend repo root. It's
gitignored; `google-services.example.json` shows the expected shape.

## 8. Get the service account key

Firebase console → **Project settings → Service accounts → Generate new private key**.
(Equivalently: GCP console → IAM & Admin → Service Accounts → Keys → Add key → JSON.
Same project.)

## 9. Configure the backend `.env`

```sh
cd ../insiit-backend-rust
cp .env.example .env
mv ~/Downloads/<key>.json ./service_account.json
```

```env
POSTGRES_URL="postgres://insiit:insiit@db:5432/insiit"
GOOGLE_APPLICATION_CREDENTIALS="./service_account.json"
GOOGLE_CLOUD_PROJECT="your-firebase-project-id"
PORT=3700
IMAGE_DIRECTORY="./images"
POSTGRES_USER="insiit"
POSTGRES_PASSWORD="insiit"
POSTGRES_DB="insiit"
```

`GOOGLE_CLOUD_PROJECT` must be the **project ID** (the slug), not the display name — it
is what the JWT validator checks the token audience against.

## 10. Postgres

Docker Compose is simplest — it brings up Postgres and the backend together, using the
`db` hostname already in `.env.example`:

```sh
docker compose up
```

For a local or remote Postgres instead, point `POSTGRES_URL` at it and change the host
from `db` to `localhost` (or the remote host). Percent-encode any special characters in
the password.

There are no migration files — tables are created idempotently on startup by
`helpers::initialize_database`.

## 11. Run the backend

Compose already runs it (`cargo watch`, hot-reloading). Standalone:

```sh
cargo run              # listens on 0.0.0.0:$PORT, default 3700
curl localhost:3700    # → "Go to /api-docs for API Documentation"
```

Startup logs go to `insiit-backend-rust.logs`, not stdout — check it if the process
dies. It panics loudly on a bad DB URL, a missing env var, or an unreadable service
account.

**Grant yourself admin** (otherwise every admin-gated endpoint 403s — the `admins` table
starts empty):

```sh
docker compose exec db psql -U insiit -d insiit -c \
  "INSERT INTO admins (email, get_admin, post_admin, put_admin, post_bus_schedule,
   put_bus_schedule, post_event, manage_events, post_mess_menu, post_outlet,
   delete_outlet, put_outlet, post_announcement, post_representative,
   delete_representative, put_representative)
   VALUES ('you@iitgn.ac.in', true, true, true, true, true, true, true, true,
           true, true, true, true, true, true, true);"
```

## 12. Configure the frontend `.env`

```sh
cd ../insiit-ui-react-native-new
npm install
cp .env.example .env
```

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3700
EXPO_PUBLIC_TIMETABLE_API_URL=https://timetable.metis-iitgn.tech/api
EXPO_PUBLIC_MESS_PORTAL_URL=http://mess.iitgn.ac.in
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=<client_type 3 id>.apps.googleusercontent.com
EXPO_PUBLIC_MAPBOX_TOKEN=
```

- **No trailing slash** on `EXPO_PUBLIC_API_BASE_URL`.
- `10.0.2.2` is the host loopback as seen from the **Android emulator**. On a physical
  device use your machine's LAN IP (`http://192.168.x.x:3700`) and make sure both are on
  the same network. Plain `http` is fine — `usesCleartextTraffic` is enabled in `app.json`.
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is the **web** client — the `"client_type": 3` entry
  under `client[].oauth_client[]` in `google-services.json`. The Android ID
  (`client_type: 1`) produces a sign-in that appears to succeed and then fails token
  exchange.
- Mapbox is optional; blank renders a "Map unavailable" placeholder and the rest of the
  app works.

Only `EXPO_PUBLIC_*` vars reach the app, and they are inlined into the bundle at build
time — never put a real secret there. Because they're baked in, editing `.env` while
Metro runs changes nothing: restart with `npx expo start --clear`. A missing required var
throws at startup with the list ([`src/core/config/checkEnv.ts`](src/core/config/checkEnv.ts)).

## 13. Prebuild and run

```sh
npx expo prebuild --clean     # regenerates android/ and ios/
npx expo run:android          # builds, installs, starts Metro
```

`android/` and `ios/` are gitignored build output — re-run prebuild after any change to
`app.json`, `plugins/`, or native dependencies. After that, `npm start` plus a reload is
enough for JS-only changes.

Confirm the build was signed by your keystore, not a stray debug one:

```sh
cd android && ./gradlew signingReport | grep -A3 'Variant: debug'
```

If `Store:` says `debug.keystore`, Gradle found no credentials — `keystore.properties` is
missing from the repo root, or it is there but has no `INSIIT_STORE_PASSWORD`.

## 14. Release build

```sh
npx expo prebuild --clean
cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
# → android/app/build/outputs/apk/release/app-release.apk  (~65 MB; universal is ~186 MB)
```

If you'd rather not keep a credentials file around, pass them per-invocation instead —
command-line properties take precedence over `keystore.properties` (note these land in
your shell history):

```sh
./gradlew assembleRelease \
  -PINSIIT_STORE_FILE=$PWD/../upload-keystore.jks \
  -PINSIIT_KEY_ALIAS=insiit-upload \
  -PINSIIT_STORE_PASSWORD=… -PINSIIT_KEY_PASSWORD=…
```

Verify before shipping:

```sh
$ANDROID_HOME/build-tools/36.0.0/apksigner verify --print-certs \
  android/app/build/outputs/apk/release/app-release.apk
```

---

## Common failures

| Symptom | Cause |
| --- | --- |
| `DEVELOPER_ERROR` / status 10 on sign-in | SHA-1 of the installed APK's signing key isn't in Firebase, or `google-services.json` predates the fingerprint, or the client ID is the Android one |
| Release build fails on signing | No `keystore.properties` in the repo root (copy `keystore.properties.example`), or no `upload-keystore.jks` beside it |
| Build signed by `debug.keystore` | Gradle found no credentials — `keystore.properties` missing from the repo root, or missing `INSIIT_STORE_PASSWORD`. Check `./gradlew signingReport` |
| `No matching client found for package name 'com.metis.insiit'` | Firebase Android app registered under a different package name |
| `Missing environment variable(s): …` | `.env` incomplete, or bundle predates the edit → `npx expo start --clear` |
| Backend panics immediately | Check `insiit-backend-rust.logs` — bad `POSTGRES_URL`, missing env var, or unreadable `service_account.json` |
| Every write returns 403 | No row for your email in `admins` |
| Network requests hang from device | `EXPO_PUBLIC_API_BASE_URL` points at `localhost` instead of `10.0.2.2` / LAN IP |
