# Notes

Deliberate shortcuts and things to revisit.

## Datetime encoding: RFC 3339 everywhere

**Every** `OffsetDateTime` in the backend schemas carries
`#[serde(with = "time::serde::rfc3339")]` — one convention, no exceptions. Keep it that
way when adding fields. `Cargo.toml` needs the `time` feature `serde-well-known` (it
implies `serde`) for that module to exist.

This matters because an *unannotated* `OffsetDateTime` silently serializes as a 9-element
JSON array `[year, ordinal, hour, min, sec, nanos, off_h, off_m, off_s]` and deserializes
via `deserialize_tuple(9)`, which no JS client can consume — `serde-well-known` does not
enable `serde-human-readable`. A missing attribute is a silent wire-format break, not a
compile error.

Chosen over unix seconds because the failure modes are loud rather than silent: a bad
RFC 3339 string 400s at the deserialize boundary, whereas a seconds/milliseconds mix-up
parses fine and renders 1970 or the year 58,000.

App side, always go through `core/api/backendTime.ts` — including `backendInstantMs()`
for sorting. Never subtract the raw values: they're strings, so `a - b` is `NaN` and
`Array.sort` silently does nothing.

Still open on the backend:
- `POST /admin` is dead: `add_admin` lists 12 columns but `VALUES ($1..$13)` with 12 binds
  → Postgres rejects it, 500 every time. Not reachable from the app any more (admins are
  managed with psql), but the route is still broken.
- Outlet `open_time`/`close_time` are recurring **clock times** modelled as instants, so
  their date component is meaningless. Buses solved this by storing `departure_time` as a
  plain `"7:30 AM"` string; outlets could do the same, or use `time::Time` + a Postgres
  `TIME` column. Note `time` ships no well-known serde format for `Time` — that route
  needs a `time::serde::format_description!` module, not just a decorator.
- **The `bus` table changed shape** (JSONB `source`/`via`/`destination` → flat
  `departure_time TIME`/`source`/`destination`/`stops TEXT[]`). `CREATE TABLE IF NOT
  EXISTS` does not migrate, so an existing deployment needs `DROP TABLE bus;`.

`departure_time` is the one clock-time field done properly: a Postgres `TIME` column,
read as `departure_time::text` and written as `$2::time`, so the Rust struct stays a
`String` with no `time::Time` serde plumbing. Postgres validates and normalises on
insert — `'7:30'` becomes `"07:30:00"`, junk is rejected with a 400 (SQLSTATE class 22).
Outlets could adopt the same trick.

## App ↔ backend mismatches still unfixed

- `busService.createBus` is never called (BusScreen's "+ Add" sets state but renders no
  modal), so `POST /buses` still has no client.
- The bus tab filter matches the **name** string ("56-Seater" vs the `BusType` tabs
  `EECO | 29 | 56`) because there is no route/type column. Renaming a row breaks its tab.
- `searchTypes.ts:12` `ApiEventResponse` is dead code from an older backend shape.
- Outlets shows "Hours unavailable" until the backend annotates `open_time`/`close_time`.
- `edit_lost_found` / `edit_buy_sell` **replace** `img_urls` with whatever
  `base64_images` contains, exactly like the add handlers — an empty array removes all
  photos. Since the client only holds URLs, opening an edit sheet downloads the existing
  photos and re-encodes them (`fetchImageAsBase64`) so they survive the save. Each edit
  therefore re-uploads every kept photo, and orphans the previous files on disk.
- No client for `POST /outlets` (no admin outlets screen) or `PUT /events/{id}` (events
  can be created and deleted, not edited). Detail endpoints (`GET /<thing>/{id}`) are
  unused by design — lists carry the full entity.
- `save_image` returns a RELATIVE path (`images/<file>`) served by `ServeDir` at `/images`,
  so anything shown in an `<Image>` must go through `resolveBackendAsset()` in
  `core/api/apiClient.ts`. Announcements and event posters were both rendering the raw
  path before this was noticed.

Fixed already: announcements writes send `description` (was `content` → 422), and
`AppPermissions` mirrors the backend's 11 keys via `NO_PERMISSIONS` (`put_event` never
existed server-side).

## Mapbox token

`EXPO_PUBLIC_MAPBOX_TOKEN` in `.env` is the **secret** `sk.*` token from the `metis-mapbox`
account, carried over from the Flutter app (`insiit-ui/lib/widgets/maps.dart:1`).
`EXPO_PUBLIC_*` values are inlined into the bundle, so anyone who unzips the APK can read
it and bill tile usage to that account.

Before release: create a `pk.*` token scoped to styles/tiles reads, put that in `.env`, and
**rotate the `sk.*`** — it's in two repos' git history.

No build-time download token is needed; the `@rnmapbox/maps` plugin adds Mapbox's Maven repo
at prebuild and treats credentials as optional. If a future SDK requires one, pass
`RNMAPBOX_MAPS_DOWNLOAD_TOKEN` as an env var or EAS secret — not `app.json`.

## Build

`@rnmapbox/maps` is native: not in Expo Go, and not in any dev build made before it was
added. After pulling: `npx expo prebuild`, then rebuild the dev client. Env vars are
inlined at bundle time — restart the dev server after editing `.env`.

## Navigation

`RootNavigator` owns headers and transitions; screens must not re-implement either.

- Built-in native-stack header, themed once in `screenOptions`. Screens pass only a
  `title`, never a hand-rolled back button or page title, and use
  `edges={["left", "right"]}` — the header clears the notch. `headerShown: false` on
  exactly two routes: `MainTabs` and `Login`.
- One transition: `animation: 'simple_push'` + `animationDuration: 200`, tuned to match the
  tab pager's spring. `animationDuration` is **iOS-only**; Android uses platform timing.
- Admin screens are a `<Stack.Group>` in the root stack, not a nested navigator —
  react-navigation's guidance is that nesting is for UI, not code organisation. Nesting
  previously cost a hidden parent header and a hand-rolled back button.
  `@react-navigation/stack` is now unused and can be dropped from `package.json`.
