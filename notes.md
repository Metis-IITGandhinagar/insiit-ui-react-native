# Notes

Running list of deliberate shortcuts and things to revisit.

## Mapbox token (added 2026-08-06)

The campus map (`src/features/map/screens/CampusMapScreen.tsx`) uses the
**secret** `sk.*` token belonging to the `metis-mapbox` account, carried over
from the Flutter app (`insiit-ui/lib/widgets/maps.dart`, line 1). It is used in
two places, both committed to this repo:

| Where | Key | Purpose |
| --- | --- | --- |
| `.env` | `EXPO_PUBLIC_MAPBOX_TOKEN` | runtime token passed to `Mapbox.setAccessToken()` |
| `app.json` | `@rnmapbox/maps` → `RNMapboxMapsDownloadToken` | build-time credential for downloading the native Mapbox SDK |

This was a conscious call to get the map working now. Two consequences to be
aware of:

1. **The runtime token ships in plain text.** `EXPO_PUBLIC_*` values are inlined
   into the JS bundle at build time, so anyone who unzips the APK can read this
   token and use it against the `metis-mapbox` account — including any scope the
   token carries beyond map tiles, and any billed tile usage.
2. **The download token is in `app.json`**, which is committed. `@rnmapbox/maps`
   marks the `RNMapboxMapsDownloadToken` option as deprecated for exactly this
   reason.

### Before any public release

- Create a **public** `pk.*` token in the Mapbox dashboard, scoped to styles/tiles
  reads only, and put that in `EXPO_PUBLIC_MAPBOX_TOKEN`. Consider URL/app
  restrictions on it.
- Move the download token out of `app.json` and supply it as the
  `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` environment variable (locally) or an EAS secret
  (CI), then delete the plugin option.
- **Rotate the current `sk.*` token** — it has been sitting in the Flutter repo's
  git history and is now in this one too, so treat it as compromised regardless
  of what we do next.

## Build requirements for the map

`@rnmapbox/maps` is a native module, so it is not available in Expo Go and not in
any dev build made before it was added. After pulling these changes:

```
npx expo prebuild
# then rebuild the dev client
```

Env vars are inlined at bundle time — restart the dev server after editing `.env`.
