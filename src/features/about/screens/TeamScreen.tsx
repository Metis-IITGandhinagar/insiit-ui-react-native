import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// lucide dropped brand icons, so Code2 stands in for the GitHub link.
import { Code2, Mail, User as UserIcon } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { Card } from '@/shared/components/Card';
import { openLink } from '@/utils/linking';
import { CONTRIBUTORS, MAINTAINERS, TeamMember } from '../data/team';

export default function TeamScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const renderMember = (member: TeamMember) => (
        <Card key={member.name} style={styles.card}>
            {member.imageUrl ? (
                <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <UserIcon size={22} color={colors.textSecondary} />
                </View>
            )}

            <View style={styles.memberInfo}>
                <Text style={styles.name} numberOfLines={1}>{member.name}</Text>

                <View style={styles.linkRow}>
                    {!!member.github && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => openLink(member.github!)}
                            activeOpacity={0.7}
                            hitSlop={6}
                        >
                            <Code2 size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                    {!!member.email && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => openLink(`mailto:${member.email}`)}
                            activeOpacity={0.7}
                            hitSlop={6}
                        >
                            <Mail size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Card>
    );

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.intro}>
                        INSIIT is built and maintained by students of Metis, the app development
                        club at IIT Gandhinagar.
                    </Text>

                    {MAINTAINERS.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Maintainers</Text>
                            {MAINTAINERS.map(renderMember)}
                        </>
                    )}

                    {CONTRIBUTORS.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Contributors</Text>
                            {CONTRIBUTORS.map(renderMember)}
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
        gap: spacing.sm,
    },
    intro: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.background,
    },
    avatarPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    linkRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
});
