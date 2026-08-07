import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/theme';

/**
 * Describes what the app actually does today. If data handling changes — a new
 * third-party SDK, analytics, a new stored field — update this screen in the same
 * commit, and bump LAST_UPDATED.
 */
const LAST_UPDATED = '6 August 2026';

interface Section {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
}

const SECTIONS: Section[] = [
    {
        heading: 'Who this is for',
        paragraphs: [
            'INSIIT is built by Metis for students of IIT Gandhinagar. Sign-in is restricted to @iitgn.ac.in Google accounts, so the app is not intended for anyone outside the institute.',
        ],
    },
    {
        heading: 'What we collect',
        paragraphs: ['When you sign in with Google, we receive and store:'],
        bullets: [
            'Your name, institute email address and profile photo, from your Google account.',
            'Anything you post in the app — events, announcements, lost & found reports, marketplace listings, bids and claims — saved together with your email address.',
            'Photos you choose to attach to a post. The photo library is only opened when you tap to add one.',
        ],
    },
    {
        heading: 'What other students can see',
        paragraphs: [
            'Content you post is visible to every signed-in student, and your institute email is shown alongside it so people can reach you about a found item or a listing. Your bids and claims are visible to the person who created that post.',
            'Only you can edit or delete your own posts. This is enforced on the server, not just in the app.',
        ],
    },
    {
        heading: 'What stays on your device',
        bullets: [
            'A cached copy of the mess menu, so it works offline.',
            'Your mess portal session, used to show your dining QR code.',
            'Your theme preference.',
        ],
        paragraphs: [
            'Signing out or uninstalling the app removes this local data.',
        ],
    },
    {
        heading: 'Services we rely on',
        bullets: [
            'Google Sign-In and Firebase Authentication, to verify you are an IITGN student.',
            'Mapbox, which serves the campus map tiles. Opening the map sends a request to Mapbox from your device.',
            'The IITGN mess portal, contacted directly by the app to fetch your dining QR code.',
            'INSIIT servers, run by Metis, which store the content described above.',
        ],
    },
    {
        heading: 'What we do not do',
        bullets: [
            'No advertising, and no advertising or analytics SDKs.',
            'We do not sell or share your data with anyone outside the institute.',
            'We do not track your location. The campus map shows the campus, not you.',
        ],
    },
    {
        heading: 'Keeping and deleting data',
        paragraphs: [
            'You can delete any post you created from within the app, which removes it from the server.',
            'To have your account and its associated content removed, contact us and we will action it.',
        ],
    },
    {
        heading: 'Contact',
        paragraphs: [
            'Questions about this policy, or a data deletion request, can be raised with Metis at IIT Gandhinagar, or as an issue on the app’s GitHub repository.',
        ],
    },
];

export default function PrivacyPolicyScreen() {
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
                    <Text style={styles.updated}>Last updated {LAST_UPDATED}</Text>

                    {SECTIONS.map((section) => (
                        <View key={section.heading} style={styles.section}>
                            <Text style={styles.heading}>{section.heading}</Text>

                            {section.paragraphs?.map((paragraph) => (
                                <Text key={paragraph} style={styles.body}>
                                    {paragraph}
                                </Text>
                            ))}

                            {section.bullets?.map((bullet) => (
                                <View key={bullet} style={styles.bulletRow}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const getStyles = ({ colors, spacing }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
    },
    updated: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    heading: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    body: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    bulletRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: 6,
        paddingRight: spacing.sm,
    },
    bulletDot: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.primary,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: colors.textSecondary,
    },
});
