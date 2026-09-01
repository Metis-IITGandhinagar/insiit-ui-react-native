const { withInfoPlist } = require('@expo/config-plugins');

// Apps linked against the iOS 26+ SDK (Xcode 27) must declare UIScene adoption or
// UIKit kills them at launch: "Application failed to launch: UIScene life cycle is
// required for apps built with this SDK."
//
// Neither React Native 0.86 nor Expo 57 emits UIApplicationSceneManifest — the
// generated AppDelegate still uses the pre-scene UIWindow lifecycle. Declaring the
// manifest with no UISceneConfigurations opts into the scene world while letting
// UIKit attach the AppDelegate's own window to the single implicit scene, which is
// what the existing startReactNative(withModuleName:in:launchOptions:) call needs.
//
// Remove this once Expo/RN ship real scene-delegate support.
module.exports = function withIosSceneManifest(config) {
  return withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
    };
    return cfg;
  });
};
