import appConfig from '../../app.json';
import otaBuild from '../../ota-build.json';

/** The native binary's version, e.g. "3.1.0". Only changes with a store release. */
export const NATIVE_VERSION: string = appConfig.expo.version;

/**
 * The OTA build number, bumped by scripts/publish-ota.mjs on every publish.
 *
 * Imported as a module rather than read from an EXPO_PUBLIC_ env var: env inlining
 * depends on Metro's transform cache seeing a changed value, and since this file's
 * own source never changes, two publishes produced byte-identical bundles (verified).
 * A JSON module is part of the dependency graph, so changing it always changes the
 * bundle.
 */
export const JS_BUILD: number = Number(otaBuild.jsBuild) || 0;

/**
 * What to show the user: "3.1.67", where 3.1 is the binary and 67 is the JS bundle
 * running on top of it. The patch segment of expo.version is deliberately replaced
 * rather than appended — the JS build is the only part that moves between store
 * releases, so it's the number worth reporting.
 */
export const DISPLAY_VERSION: string = (() => {
    const [major, minor] = NATIVE_VERSION.split('.');
    return `${major}.${minor}.${JS_BUILD}`;
})();
