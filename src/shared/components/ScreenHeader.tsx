import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@core/theme';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    /** Optional trailing control — an add button, a filter, an icon. */
    right?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

/**
 * The title block for a tab screen.
 *
 * Tabs live inside MainTabs, which sets `headerShown: false`, so each one used to draw
 * its own header — and they drifted: three different title sizes (30/800, 28/bold,
 * 30/700), two alignments, and five different distances from the top of the screen.
 *
 * Left-aligned to match the pushed stack screens and Home's greeting, and sized from
 * the typography scale rather than hardcoded numbers. The top padding lives here so
 * every tab sits the same distance below the status bar; screens using this must not
 * add their own paddingTop.
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, right, style }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.text}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                {!!subtitle && (
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {right}
        </View>
    );
};

export default ScreenHeader;

const getStyles = ({ colors, spacing, typography }: any) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            // The single source of the gap between the safe-area inset and the title.
            paddingTop: spacing.md,
        },
        text: {
            flex: 1,
        },
        title: {
            ...typography.h1,
            color: colors.text,
        },
        subtitle: {
            marginTop: 2,
            ...typography.caption,
            color: colors.textSecondary,
        },
    });
