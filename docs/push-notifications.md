# Push notifications

Push delivery is handled by the Rust API through Firebase Cloud Messaging (FCM).
The client registers the native FCM token at `POST /push/devices` after the signed-in
user grants notification permission. Device IDs are stable per installation and live
in iOS Keychain / Android Keystore via Expo SecureStore. Signing out removes that
device registration. Reminder preference changes use `PUT /push/preferences`.

The API creates or upgrades the `push_devices` and `event_push_jobs` tables during its
normal database initialization. It enqueues approval notifications only for the
event submitter, and reminders only for that submitter's devices with reminders
enabled. The queue worker leases due jobs, retries transient FCM failures, removes
unregistered tokens, and skips reminders when an event is too close or has started.

## Backend deployment

- Set `GOOGLE_CLOUD_PROJECT` to the Firebase project ID, as for the existing Firebase
  authentication integration.
- Give the backend's Google Application Default Credentials a service account with
  permission to send Firebase Cloud Messaging messages. Enable the Firebase Cloud
  Messaging API for that project. Do not place service account credentials in the app
  or its `EXPO_PUBLIC_*` variables.
- Keep PostgreSQL available to the API worker. Job state is persisted in Postgres;
  the worker leases jobs so restarts and multiple API replicas do not immediately
  claim the same delivery.
- Existing database initialization applies the required `CREATE TABLE` and additive
  `ALTER TABLE` statements on startup. Back up the database before deploying schema
  changes, as with other backend releases.

## Mobile builds and limitations

- Firebase Android and iOS app configuration files must belong to the same Firebase
  project as `GOOGLE_CLOUD_PROJECT`. Configure APNs authentication in Firebase for
  iOS delivery.
- Remote notifications require native Android/iOS builds and a physical device (or a
  supported simulator); Expo Go does not provide the native FCM setup used here.
  Rebuild and distribute the app after native configuration changes.
- On first signed-in use, the app requests permission once. If permission has been
  denied, users can enable it from device settings; the app will register the FCM
  token after permission is granted.
- Delivery timing is controlled by FCM and the operating system. The backend schedules
  the reminder at the event's RFC 3339 start instant minus ten minutes, but network,
  power, Focus, and OS notification settings can delay or suppress display.
