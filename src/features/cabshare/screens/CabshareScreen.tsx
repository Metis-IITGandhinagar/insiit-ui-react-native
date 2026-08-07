import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Users } from 'lucide-react-native';

import { useTheme } from '@/core/theme';

/**
 * Placeholder. There is no cabshare API yet, so the screen states that plainly rather
 * than showing buttons that do nothing.
 */
export default function CabshareScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={["left", "right"]}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.heroCard}>
                        <Users size={32} color={colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={styles.heroTitle}>Find ride buddies</Text>
                        <Text style={styles.heroSubtitle}>
                            Share cabs with fellow students going your way. Save money, make friends.
                        </Text>
                    </View>

                    <View style={styles.comingSoonCard}>
                        <View style={styles.badge}>
                            <Clock size={14} color={colors.primary} />
                            <Text style={styles.badgeText}>Coming soon</Text>
                        </View>

                        <Text style={styles.comingSoonBody}>
                            Cabshare is still being built. Once it lands you'll be able to post a
                            ride you're taking, find students heading the same way, and split the
                            fare.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const getStyles = ({ colors, spacing, radius }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.md,
    },
    heroCard: {
        backgroundColor: colors.primary + '12',
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    heroSubtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    comingSoonCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.md,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${colors.primary}15`,
        borderRadius: radius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    comingSoonBody: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
});
