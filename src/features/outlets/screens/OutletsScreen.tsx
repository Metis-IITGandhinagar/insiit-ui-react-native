import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock3, MapPin } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { formatBackendTime } from '@/core/api/backendTime';
import { useOutlets } from '../hooks/useOutlets';

export default function OutletsScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const { outlets, loading, error, refresh } = useOutlets();

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={["left", "right"]}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
                    }
                >
                    <View style={styles.heroCard}>
                        <Text style={styles.heroTitle}>Campus favourites</Text>
                        <Text style={styles.heroSubtitle}>
                            Discover quick bites, tea spots, and convenience picks around campus.
                        </Text>
                    </View>

                    {loading && outlets.length === 0 ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorText}>{error}</Text>
                            <Text style={styles.emptyHint}>Pull down to try again.</Text>
                        </View>
                    ) : outlets.length === 0 ? (
                        <View style={styles.centered}>
                            <Text style={styles.emptyTitle}>No outlets listed yet</Text>
                            <Text style={styles.emptyHint}>
                                Outlets added by the admin team will show up here.
                            </Text>
                        </View>
                    ) : (
                        outlets.map((outlet) => {
                            const opens = formatBackendTime(outlet.open_time);
                            const closes = formatBackendTime(outlet.close_time);
                            const hours = opens && closes ? `${opens} – ${closes}` : 'Hours unavailable';

                            return (
                                <View key={outlet.id} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{outlet.name}</Text>
                                        {outlet.menu.length > 0 && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>
                                                    {outlet.menu.length} items
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {!!outlet.description && (
                                        <Text style={styles.cardSubtitle}>{outlet.description}</Text>
                                    )}

                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Clock3 size={14} color={colors.textSecondary} />
                                            <Text style={styles.metaText}>{hours}</Text>
                                        </View>
                                        {!!outlet.landmark && (
                                            <View style={styles.metaItem}>
                                                <MapPin size={14} color={colors.textSecondary} />
                                                <Text style={styles.metaText}>{outlet.landmark}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {outlet.menu.length > 0 && (
                                        <View style={styles.menuBlock}>
                                            {outlet.menu.slice(0, 5).map((item) => (
                                                <View key={item.name} style={styles.menuRow}>
                                                    <Text style={styles.menuName} numberOfLines={1}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={styles.menuPrice}>₹{item.price}</Text>
                                                </View>
                                            ))}
                                            {outlet.menu.length > 5 && (
                                                <Text style={styles.menuMore}>
                                                    +{outlet.menu.length - 5} more
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
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
        paddingTop: spacing.sm,
        paddingBottom: 120,
        gap: spacing.md,
    },
    heroCard: {
        backgroundColor: colors.primary + '12',
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.primary + '20',
    },
    heroTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    heroSubtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    centered: {
        paddingVertical: spacing.xxl,
        alignItems: 'center',
        gap: spacing.xs,
    },
    errorText: {
        color: colors.danger,
        fontWeight: '600',
        fontSize: 15,
    },
    emptyTitle: {
        color: colors.text,
        fontWeight: '700',
        fontSize: 15,
    },
    emptyHint: {
        color: colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        flexShrink: 1,
    },
    badge: {
        backgroundColor: colors.primary + '12',
        borderRadius: radius.round,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: spacing.md,
    },
    metaRow: {
        gap: spacing.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: 12,
        flexShrink: 1,
    },
    menuBlock: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: 6,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    menuName: {
        color: colors.text,
        fontSize: 13,
        flexShrink: 1,
    },
    menuPrice: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },
    menuMore: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
});
