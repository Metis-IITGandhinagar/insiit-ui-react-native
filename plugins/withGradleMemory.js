const { withGradleProperties } = require('@expo/config-plugins');

// The Expo template ships `-Xmx2048m -XX:MaxMetaspaceSize=512m`, which was fine until
// expo-updates arrived: its Gradle plugin is built against a different Kotlin version
// than the app, so the build now runs *two* KotlinCompileDaemons alongside the Gradle
// daemon. Each inherits org.gradle.jvmargs, and KSP (`:expo-updates:kspReleaseKotlin`)
// blows through a 512 MB metaspace cap — the failure is `OutOfMemoryError: Metaspace`,
// not a heap error, so raising -Xmx alone does nothing.
//
// Metaspace lives outside the heap and holds class metadata; KSP loads a lot of it.
// These are caps, not reservations, so raising them costs nothing when unused.
//
// Tuned for an 8 GB machine. If a build still dies with Metaspace, drop the separate
// Kotlin daemons entirely instead of raising these further:
//   kotlin.compiler.execution.strategy=in-process
// which trades incremental-build speed for one JVM instead of three.
const PROPERTIES = {
  'org.gradle.jvmargs': '-Xmx2048m -XX:MaxMetaspaceSize=1024m',

  // Without this the Kotlin daemons silently inherit org.gradle.jvmargs; setting it
  // explicitly is what actually raises the cap for the KSP step.
  'kotlin.daemon.jvmargs': '-Xmx1536m -XX:MaxMetaspaceSize=1024m',

  // Three JVMs on 8 GB thrash if they also run tasks concurrently. Serial is slower
  // per build but does not swap.
  'org.gradle.parallel': 'false',
  'org.gradle.workers.max': '2',
};

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (config) => {
    for (const [key, value] of Object.entries(PROPERTIES)) {
      const existing = config.modResults.find(
        (item) => item.type === 'property' && item.key === key
      );
      if (existing) {
        existing.value = value;
      } else {
        config.modResults.push({ type: 'property', key, value });
      }
    }
    return config;
  });
};
