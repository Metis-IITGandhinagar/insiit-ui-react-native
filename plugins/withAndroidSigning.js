const { withAppBuildGradle } = require('@expo/config-plugins');

// The template's signingConfigs block, reproduced verbatim so we can detect it.
const TEMPLATE_SIGNING_CONFIGS = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;

// Debug falls back to the template keystore so a fresh clone still builds;
// release has no fallback on purpose — an unsigned/debug-signed release is worse
// than a failed build.
const SIGNING_CONFIGS = `    signingConfigs {
        debug {
            storeFile file(findProperty('INSIIT_DEBUG_STORE_FILE') ?: 'debug.keystore')
            storePassword findProperty('INSIIT_DEBUG_STORE_PASSWORD') ?: 'android'
            keyAlias findProperty('INSIIT_DEBUG_KEY_ALIAS') ?: 'androiddebugkey'
            keyPassword findProperty('INSIIT_DEBUG_KEY_PASSWORD') ?: 'android'
        }
        release {
            if (project.hasProperty('INSIIT_STORE_FILE')) {
                storeFile file(INSIIT_STORE_FILE)
                storePassword INSIIT_STORE_PASSWORD
                keyAlias INSIIT_KEY_ALIAS
                keyPassword INSIIT_KEY_PASSWORD
            }
        }
    }`;

const TEMPLATE_RELEASE_SIGNING = `            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug`;

const RELEASE_SIGNING = `            signingConfig signingConfigs.release`;

module.exports = function withAndroidSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes('INSIIT_STORE_FILE')) {
      return config; // already applied
    }

    if (!contents.includes(TEMPLATE_SIGNING_CONFIGS)) {
      throw new Error(
        '[withAndroidSigning] Could not find the expected signingConfigs block in ' +
          'android/app/build.gradle. The Expo template likely changed — update ' +
          'plugins/withAndroidSigning.js to match.'
      );
    }
    contents = contents.replace(TEMPLATE_SIGNING_CONFIGS, SIGNING_CONFIGS);

    if (!contents.includes(TEMPLATE_RELEASE_SIGNING)) {
      throw new Error(
        '[withAndroidSigning] Could not find the release buildType signingConfig in ' +
          'android/app/build.gradle. Update plugins/withAndroidSigning.js to match.'
      );
    }
    contents = contents.replace(TEMPLATE_RELEASE_SIGNING, RELEASE_SIGNING);

    config.modResults.contents = contents;
    return config;
  });
};
