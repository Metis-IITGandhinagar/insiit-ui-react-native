const { withPodfile } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

// Xcode 27 refuses to build any target whose IPHONEOS_DEPLOYMENT_TARGET is below
// 15.0. Several transitive pods (and the *_Privacy resource bundles CocoaPods
// synthesises for them) still declare 9.0-14.0: GoogleUtilities, PromisesObjC,
// AppAuth, GTMSessionFetcher, MapboxMapsResources, RNSVGFilters, RNCAsyncStorage.
// react_native_post_install only normalises the pods React Native knows about,
// so the rest fail the build with "range of supported deployment target versions
// is 15.0 to 27.0.x".
//
// Raise every pod target to the app's own minimum. Keep this in sync with
// IPHONEOS_DEPLOYMENT_TARGET in app.json / the Expo template default (16.4).
const MIN_DEPLOYMENT_TARGET = '16.4';

const SNIPPET = `    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        current = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || Gem::Version.new(current) < Gem::Version.new('${MIN_DEPLOYMENT_TARGET}')
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${MIN_DEPLOYMENT_TARGET}'
        end
      end
    end`;

module.exports = function withIosPodMinDeploymentTarget(config) {
  return withPodfile(config, (cfg) => {
    cfg.modResults.contents = mergeContents({
      tag: 'insiit-pod-min-deployment-target',
      src: cfg.modResults.contents,
      newSrc: SNIPPET,
      // Land inside the generated `post_install do |installer|` block, after
      // react_native_post_install has had its say.
      anchor: /react_native_post_install\(/,
      offset: 6,
      comment: '#',
    }).contents;
    return cfg;
  });
};
