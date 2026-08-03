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
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Clock3, MapPin } from 'lucide-react-native';

import { useTheme } from '@/core/theme';

const outletData = [
    {
        title: 'Go Insta',
        subtitle: 'Fresh meals, quick bites, and amazing snacks',
        time: 'Open till 3:00 AM',
        location: 'Hiqom Hostel',
    },
    {
        title: 'Tea Post',
        subtitle: 'Coffee, chai, and a relaxed study break',
        time: 'Open till 2:00 AM',
        location: 'Near Emiet Hostel',
    },
    {
        title: 'South Point',
        subtitle: 'Idli, Dosa and that refreshing Filter Coffee...',
        time: 'Open till 10:00 PM',
        location: 'Near Chimair Hostel',
    },
];

export default function OutletsScreen() {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <ArrowLeft size={18} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.headerTextWrap}>
                        <Text style={styles.title}>Outlets</Text>
                        <Text style={styles.subtitle}>Browse campus favourites without leaving the app.</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.heroCard}>
                        <Text style={styles.heroTitle}>Campus favourites</Text>
                        <Text style={styles.heroSubtitle}>
                            Discover quick bites, tea spots, and convenience picks around campus.
                        </Text>
                    </View>

                    {outletData.map((item) => (
                        <View key={item.title} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Open</Text>
                                </View>
                            </View>

                            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <Clock3 size={14} color={colors.textSecondary || '#666'} />
                                    <Text style={styles.metaText}>{item.time}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <MapPin size={14} color={colors.textSecondary || '#666'} />
                                    <Text style={styles.metaText}>{item.location}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const getStyles = ({ colors, spacing, radius, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerTextWrap: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        ...typography.h2,
        color: colors.text,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 2,
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
});
