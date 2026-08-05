# Notes

Running list of deliberate shortcuts and things to revisit.

## Mapbox token (added 2026-08-06)

The campus map (`src/features/map/screens/CampusMapScreen.tsx`) uses the
**secret** `sk.*` token belonging to the `metis-mapbox` account, carried over
from the Flutter app (`insiit-ui/lib/widgets/maps.dart`, line 1). It lives in
exactly one committed place:

| Where | Key | Purpose |
| --- | --- | --- |
| `.env` | `EXPO_PUBLIC_MAPBOX_TOKEN` | runtime token passed to `Mapbox.setAccessToken()` |

This was a conscious call to get the map working now. The consequence to be aware
of: **the token ships in plain text.** `EXPO_PUBLIC_*` values are inlined into the
JS bundle at build time, so anyone who unzips the APK can read it and use it
against the `metis-mapbox` account — including any scope the token carries beyond
map tiles, and any billed tile usage.

No build-time download token is needed. The `@rnmapbox/maps` config plugin adds
Mapbox's Maven repo at prebuild and treats credentials as optional (Mapbox
dropped the download-token requirement), so `RNMapboxMapsDownloadToken` was
removed from `app.json` after verifying `:app:dependencies` still resolves. If a
future SDK version does require one, pass it as the
`RNMAPBOX_MAPS_DOWNLOAD_TOKEN` environment variable or an EAS secret rather than
putting it back in `app.json`.

### Before any public release

- Create a **public** `pk.*` token in the Mapbox dashboard, scoped to styles/tiles
  reads only, and put that in `EXPO_PUBLIC_MAPBOX_TOKEN`. Consider URL/app
  restrictions on it.
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

## Navigation headers and transitions (added 2026-08-06)

The root stack in `src/core/navigation/RootNavigator.tsx` owns both of these, so
screens should not re-implement them:

- **Headers.** `screenOptions` turns the built-in native-stack header on for the
  whole stack and themes it once. Each screen supplies only a `title` in its
  `options`. Screens must therefore *not* hand-roll a back button or a page title,
  and their `SafeAreaView` should use `edges={["left", "right"]}` — the header
  already clears the notch. `headerShown: false` is set on exactly two routes:
  `MainTabs` (draws the floating navbar and pager) and `Login`.
- **Transitions.** One `animation: 'simple_push'` + `animationDuration: 200` for
  the whole stack, chosen to feel as quick as the tab pager's spring. Note that
  `animationDuration` only affects iOS; on Android the platform push timing
  applies. Because every screen lives in this one stack, there is a single
  transition across the app rather than one per navigator.

The admin screens used to be a nested JS `createStackNavigator`: slower and
visibly different, and it needed a hidden parent header plus a hand-rolled back
button on its first route. They are now plain screens in the root stack wrapped in
a `<Stack.Group>`. react-navigation's guidance is "think of nesting as a way to
achieve the UI you want, not a way to organize your code", with `Group` as the
organising tool. Consequence: `@react-navigation/stack` is no longer imported
anywhere and can be dropped from `package.json`.
