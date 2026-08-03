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
import { ArrowLeft, Users } from 'lucide-react-native';

import { useTheme } from '@/core/theme';

export default function CabshareScreen() {
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
                        <Text style={styles.title}>Cabshare</Text>
                        <Text style={styles.subtitle}>Ride with campus mates.</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.heroCard}>
                        <Users size={40} color={colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={styles.heroTitle}>Find ride buddies</Text>
                        <Text style={styles.heroSubtitle}>
                            Share cabs with fellow students going your way. Save money, make friends.
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Offer a Ride</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary }]}
                    >
                        <Text style={[styles.actionButtonText, { color: colors.primary }]}>Find a Ride</Text>
                    </TouchableOpacity>
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
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    heroSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});
