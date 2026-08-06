# Notes

Deliberate shortcuts and things to revisit.

## ⚠️ Backend datetime encoding (`../insiit-backend-rust`)

The backend's `time` dependency enables `serde` but **not** `serde-human-readable`. With
that combination an unannotated `OffsetDateTime` serializes as a **9-element JSON array**
`[year, ordinal, hour, min, sec, nanos, off_h, off_m, off_s]` and deserializes via
`deserialize_tuple(9)` — unusable from JS. Every datetime field therefore needs an
explicit `#[serde(with = …)]`, and the codebase is inconsistent about it:

| Field | Encoding |
| --- | --- |
| `EventEntry.start_datetime` | `rfc3339` ✅ |
| **`EventRequest.start_datetime`** | **none → breaks `POST`/`PUT /events` with 400** |
| **`Outlet` / `OutletRequest` `open_time`, `close_time`** | **none → broken (×4)** |
| bus / announcements / buy_sell / lost_found timestamps | `timestamp` (unix **seconds**) — works, inconsistent |

Also open on the backend:
- `POST /admin` is dead: `add_admin` lists 12 columns but `VALUES ($1..$13)` with 12 binds
  → Postgres rejects it, 500 every time.
- `BusStop.time` is an `OffsetDateTime`, but schedules recur daily so the date is
  meaningless. `time::Time` + a Postgres `TIME` column fits; decided against for now.
  Note `time` ships no well-known serde format for `Time` — it needs a
  `time::serde::format_description!` module, not just a decorator.

Unix seconds are a footgun from JS: `new Date()` takes **milliseconds**. Nothing in the
app reads those fields yet.

## App ↔ backend mismatches still unfixed

- **Bus is fully incompatible.** `busTypes.ts` expects `{_id, BusName, DepartureTime:
  "7:30 AM", Source, Destination, Stops: string[]}`; the backend returns `{id, name,
  source: {time, location}, via: [...], destination}`. `useBusData.ts:30` calls
  `bus.BusName.toLowerCase()` → **TypeError on any non-empty response**; the tab only
  works while the table is empty. `via` carries a time per stop, which the flat
  `Stops: string[]` can't represent — needs a UI decision, not a rename.
- `busService.createBus` is never called (BusScreen's "+ Add" sets state but renders no
  modal), so `POST /buses` still has no client — blocked on the bus model above.
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
