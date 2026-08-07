import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code2, ExternalLink, Users } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { Card } from '@/shared/components/Card';
import { openLink } from '@/utils/linking';
import { LINKS } from '@/constants/links';
import appConfig from '../../../../app.json';

export default function AboutScreen() {
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
                    <View style={styles.hero}>
                        <Image source={require('../../../../assets/icon.png')} style={styles.logo} />
                        <Text style={styles.appName}>INSIIT</Text>
                        <Text style={styles.tagline}>Connecting IIT Gandhinagar</Text>
                    </View>

                    <Card style={styles.card}>
                        <Text style={styles.body}>
                            INSIIT is the student app for IIT Gandhinagar. It brings the things you
                            check every day into one place — the mess menu and your dining QR, bus
                            timings, campus events, outlets, and lost &amp; found.
                        </Text>
                        <Text style={styles.body}>
                            The app is built and maintained by <Text style={styles.emphasis}>Metis</Text>,
                            the app development club. The content inside it — events, announcements,
                            menus and schedules — is published by the respective council secretaries
                            and student bodies.
                        </Text>
                    </Card>

                    <Text style={styles.sectionTitle}>Open source</Text>
                    <Card style={styles.listCard}>
                        <TouchableOpacity
                            style={styles.linkRow}
                            onPress={() => openLink(LINKS.repository)}
                            activeOpacity={0.7}
                        >
                            <Code2 size={20} color={colors.primary} />
                            <View style={styles.linkTextWrap}>
                                <Text style={styles.linkTitle}>Contribute</Text>
                                <Text style={styles.linkSubtitle}>
                                    Report an issue or open a pull request
                                </Text>
                            </View>
                            <ExternalLink size={16} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.linkRow}
                            onPress={() => openLink(LINKS.metis)}
                            activeOpacity={0.7}
                        >
                            <Users size={20} color={colors.primary} />
                            <View style={styles.linkTextWrap}>
                                <Text style={styles.linkTitle}>Metis, IITGN</Text>
                                <Text style={styles.linkSubtitle}>Everything else the club builds</Text>
                            </View>
                            <ExternalLink size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </Card>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Version {appConfig.expo.version}</Text>
                        <Text style={styles.footerText}>© Metis, IIT Gandhinagar</Text>
                    </View>
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
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.md,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    logo: {
        width: 88,
        height: 88,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
    },
    appName: {
        ...typography.h1,
        color: colors.text,
    },
    tagline: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    card: {
        gap: spacing.md,
    },
    body: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.textSecondary,
    },
    emphasis: {
        color: colors.text,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: spacing.md,
    },
    listCard: {
        padding: 0,
        overflow: 'hidden',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    linkTextWrap: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    linkSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.lg + 20 + 16,
    },
    footer: {
        alignItems: 'center',
        marginTop: spacing.lg,
        gap: 2,
    },
    footerText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});
