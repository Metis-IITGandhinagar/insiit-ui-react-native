import React from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Megaphone } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { formatBackendDateTime } from '@/core/api/backendTime';
import { resolveBackendAsset } from '@/core/api/apiClient';
import { useAnnouncements } from '../hooks/useAnnouncements';

export default function AnnouncementsScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const { announcements, loading, error, refresh } = useAnnouncements();

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
                    {loading && announcements.length === 0 ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorText}>{error}</Text>
                            <Text style={styles.emptyHint}>Pull down to try again.</Text>
                        </View>
                    ) : announcements.length === 0 ? (
                        <View style={styles.centered}>
                            <Megaphone size={32} color={colors.textSecondary} />
                            <Text style={styles.emptyTitle}>No announcements</Text>
                            <Text style={styles.emptyHint}>
                                Notices from the student bodies will appear here.
                            </Text>
                        </View>
                    ) : (
                        announcements.map((announcement) => (
                            <View key={announcement.id} style={styles.card}>
                                {!!announcement.img_url && (
                                    <Image
                                        source={{ uri: resolveBackendAsset(announcement.img_url) }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                )}

                                <View style={styles.cardHeader}>
                                    <Megaphone size={18} color={colors.primary} />
                                    <Text style={styles.cardTitle}>{announcement.title}</Text>
                                </View>

                                <Text style={styles.cardBody}>{announcement.description}</Text>

                                <Text style={styles.metaText}>
                                    {announcement.added_by_email}
                                    {!!formatBackendDateTime(announcement.added_on_timestamp) &&
                                        ` · ${formatBackendDateTime(announcement.added_on_timestamp)}`}
                                </Text>
                            </View>
                        ))
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
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.md,
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
        marginTop: spacing.sm,
    },
    emptyHint: {
        color: colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: radius.md,
        marginBottom: spacing.md,
        backgroundColor: colors.background,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        flexShrink: 1,
    },
    cardBody: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: spacing.sm,
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: 12,
    },
});
