// src/features/map/screens/CampusMapScreen.tsx
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';

import { useTheme } from '@/core/theme';

// IIT Gandhinagar campus centre. Mapbox takes coordinates as [longitude, latitude].
const CAMPUS_CENTER: [number, number] = [72.68475, 23.21049];
const CAMPUS_ZOOM = 17;

// Must be referenced as a static `process.env.X` property so Expo can inline it at bundle time.
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

// Must be a PUBLIC pk.* token — EXPO_PUBLIC_* values are inlined into the bundle and.
Mapbox.setAccessToken(MAPBOX_TOKEN ?? null);

export default function CampusMapScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <View style={styles.mapWrapper}>
                    {MAPBOX_TOKEN ? (
                        <MapView
                            style={styles.map}
                            styleURL={theme.isDark ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Street}
                            scaleBarEnabled={false}
                            logoEnabled
                            attributionEnabled
                        >
                            <Camera
                                defaultSettings={{
                                    centerCoordinate: CAMPUS_CENTER,
                                    zoomLevel: CAMPUS_ZOOM,
                                }}
                                centerCoordinate={CAMPUS_CENTER}
                                zoomLevel={CAMPUS_ZOOM}
                                animationMode="none"
                                animationDuration={0}
                            />
                        </MapView>
                    ) : (
                        <View style={styles.fallback}>
                            <Text style={styles.fallbackTitle}>Map unavailable</Text>
                            <Text style={styles.fallbackText}>
                                Set EXPO_PUBLIC_MAPBOX_TOKEN in your .env to a Mapbox access token
                                and restart the dev server.
                            </Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
}

const getStyles = ({ colors, spacing, radius }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    mapWrapper: {
        flex: 1,
        marginHorizontal: spacing.lg,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        backgroundColor: colors.surface,
    },
    map: {
        flex: 1,
    },
    fallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    fallbackTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    fallbackText: {
        fontSize: 13,
        lineHeight: 18,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
