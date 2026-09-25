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

// Every value resolves in this order, so no build step depends on a POSIX shell
// having sourced anything (that was why Windows silently fell back to the
// template debug.keystore):
//
//   1. a Gradle property  -P… / ORG_GRADLE_PROJECT_… / ~/.gradle/gradle.properties
//   2. keystore.properties at the repo root — read by Gradle itself, cross-platform
//   3. upload-keystore.jks at the repo root, else the template debug.keystore
//
// Release still has no *debug* fallback on purpose — an unsigned/debug-signed
// release is worse than a failed build.
const SIGNING_CONFIGS = `    def insiitLocalProps = new Properties()
    def insiitLocalPropsFile = rootProject.file('../keystore.properties')
    if (insiitLocalPropsFile.exists()) {
        insiitLocalPropsFile.withInputStream { insiitLocalProps.load(it) }
    }

    // Accepts both \`INSIIT_…\` and the legacy \`ORG_GRADLE_PROJECT_INSIIT_…\` spelling,
    // so an existing keystore.properties written for \`set -a; source\` still works.
    def insiitProp = { String name, fallback ->
        project.findProperty(name)
            ?: insiitLocalProps.getProperty(name)
            ?: insiitLocalProps.getProperty('ORG_GRADLE_PROJECT_' + name)
            ?: fallback
    }

    // Relative store paths resolve against the repo root, not android/app/.
    def insiitStoreFile = { value ->
        def candidate = new File(value.toString())
        candidate.isAbsolute() ? candidate : rootProject.file('../' + value)
    }

    def insiitRootKeystore = rootProject.file('../upload-keystore.jks')
    def insiitStore = insiitProp('INSIIT_STORE_FILE', null)
    def insiitStorePassword = insiitProp('INSIIT_STORE_PASSWORD', null)
    def insiitDebugStore = insiitProp('INSIIT_DEBUG_STORE_FILE', null)

    // Sign debug with the release key when that is all we have, so there is a single
    // SHA-1 to register — but only if its password is actually resolvable, otherwise a
    // fresh clone carrying the .jks could no longer build a debug APK.
    def insiitDebugUsesRootKeystore =
        insiitDebugStore == null && insiitRootKeystore.exists() && insiitStorePassword != null

    signingConfigs {
        debug {
            if (insiitDebugStore != null) {
                storeFile insiitStoreFile(insiitDebugStore)
                storePassword insiitProp('INSIIT_DEBUG_STORE_PASSWORD', 'android')
                keyAlias insiitProp('INSIIT_DEBUG_KEY_ALIAS', 'androiddebugkey')
                keyPassword insiitProp('INSIIT_DEBUG_KEY_PASSWORD', 'android')
            } else if (insiitDebugUsesRootKeystore) {
                storeFile insiitRootKeystore
                storePassword insiitStorePassword
                keyAlias insiitProp('INSIIT_KEY_ALIAS', null)
                keyPassword insiitProp('INSIIT_KEY_PASSWORD', insiitStorePassword)
            } else {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
                logger.lifecycle('[insiit] debug: template debug.keystore ' +
                    '(no INSIIT_DEBUG_* and no usable ../upload-keystore.jks)')
            }
        }
        release {
            if (insiitStore != null) {
                storeFile insiitStoreFile(insiitStore)
                storePassword insiitStorePassword
                keyAlias insiitProp('INSIIT_KEY_ALIAS', null)
                keyPassword insiitProp('INSIIT_KEY_PASSWORD', insiitStorePassword)
            } else if (insiitRootKeystore.exists()) {
                storeFile insiitRootKeystore
                storePassword insiitStorePassword
                keyAlias insiitProp('INSIIT_KEY_ALIAS', null)
                keyPassword insiitProp('INSIIT_KEY_PASSWORD', insiitStorePassword)
            }
            // else: left unconfigured so the release build fails loudly.
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
