// src/core/config/checkEnv.ts
//
// Fails fast at startup when the .env is incomplete, so a missing variable shows up
// as one readable error instead of a "Network Error" or a blank map three screens in.
//
// Expo's Metro transform inlines EXPO_PUBLIC_* values at BUNDLE time, and only when
// written as a static `process.env.NAME` member expression — hence the literal list
// below rather than a loop over names. Anything inlined is readable by anyone who
// unzips the APK, so real secrets belong on the backend, never in an EXPO_PUBLIC_ var.
//
// Values are baked in at bundle time: restart the dev server (npx expo start --clear)
// after editing .env.

const REQUIRED = {
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_TIMETABLE_API_URL: process.env.EXPO_PUBLIC_TIMETABLE_API_URL,
  EXPO_PUBLIC_MESS_PORTAL_URL: process.env.EXPO_PUBLIC_MESS_PORTAL_URL,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

// EXPO_PUBLIC_MAPBOX_TOKEN is deliberately NOT required: without it the campus map
// renders a "Map unavailable" placeholder, so contributors can skip Mapbox setup.

export function checkEnv(): void {
  const missing = Object.entries(REQUIRED)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.\n` +
        `Copy .env.example to .env, fill in the values, and restart with a cleared cache ` +
        `(npx expo start --clear) — env vars are inlined at bundle time. See README.md.`
    );
  }
}
