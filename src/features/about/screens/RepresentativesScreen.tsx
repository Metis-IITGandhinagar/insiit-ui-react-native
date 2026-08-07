import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, Users } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { Card } from '@/shared/components/Card';
import { makecall, openLink } from '@/utils/linking';
import { STUDENT_COUNCIL } from '../data/representatives';

export default function RepresentativesScreen() {
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
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {STUDENT_COUNCIL.length === 0 ? (
                        <View style={styles.empty}>
                            <Users size={32} color={colors.textSecondary} />
                            <Text style={styles.emptyTitle}>Not published yet</Text>
                            <Text style={styles.emptyHint}>
                                The student council contact list for this academic year will appear
                                here once it has been confirmed.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.intro}>
                                Reach the Student Council directly about anything they oversee.
                            </Text>

                            {STUDENT_COUNCIL.map((rep) => (
                                <Card key={rep.position} style={styles.card}>
                                    <Text style={styles.position}>{rep.position}</Text>
                                    <Text style={styles.name}>{rep.name}</Text>

                                    <View style={styles.actions}>
                                        {!!rep.email && (
                                            <TouchableOpacity
                                                style={styles.action}
                                                onPress={() => openLink(`mailto:${rep.email}`)}
                                                activeOpacity={0.7}
                                            >
                                                <Mail size={16} color={colors.primary} />
                                                <Text style={styles.actionText} numberOfLines={1}>
                                                    {rep.email}
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        {!!rep.mobile && (
                                            <TouchableOpacity
                                                style={styles.action}
                                                onPress={() => makecall(rep.mobile!)}
                                                activeOpacity={0.7}
                                            >
                                                <Phone size={16} color={colors.primary} />
                                                <Text style={styles.actionText}>{rep.mobile}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </Card>
                            ))}
                        </>
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
        flexGrow: 1,
    },
    intro: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
    },
    card: {
        gap: 2,
    },
    position: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
    },
    actions: {
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: `${colors.primary}12`,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
    },
    actionText: {
        flex: 1,
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    emptyHint: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
