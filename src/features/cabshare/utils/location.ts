import { Platform } from 'react-native';
import { locationManager, requestAndroidLocationPermissions } from '@rnmapbox/maps';

/**
 * One GPS fix for check-in, through Mapbox's location manager: it is already in the
 * native build for the campus map, so check-in needs no new native module.
 *
 * Resolves with the first fix within `timeoutMs`, or throws a message for the rider.
 */
export async function currentPosition(timeoutMs = 12000): Promise<{ lat: number; lng: number }> {
    if (Platform.OS === 'android') {
        const granted = await requestAndroidLocationPermissions().catch(() => false);
        if (!granted) {
            throw new Error('Allow location access for INSIIT to check in at the pickup point.');
        }
    }
    return new Promise((resolve, reject) => {
        let done = false;
        const finish = (fn: () => void) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            locationManager.removeListener(onFix);
            locationManager.stop();
            fn();
        };
        const onFix = (loc: { coords: { latitude: number; longitude: number } }) =>
            finish(() => resolve({ lat: loc.coords.latitude, lng: loc.coords.longitude }));
        const timer = setTimeout(
            () => finish(() => reject(new Error('Could not get your location. Turn on GPS and try again.'))),
            timeoutMs
        );
        try {
            locationManager.addListener(onFix);
            locationManager.start(0);
        } catch {
            finish(() => reject(new Error('Location is not available on this version of the app. Update INSIIT to check in.')));
        }
    });
}
