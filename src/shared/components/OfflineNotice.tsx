import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useTheme } from '@core/theme';

interface OfflineNoticeProps {
    /** True when the last fetch failed and what's on screen came from disk. */
    visible: boolean;
    /** Epoch ms the displayed data was last fetched. */
    lastUpdatedAt?: number | null;
}

/** "just now" / "12m ago" / "3h ago" / "2d ago". */
export const formatRelativeAge = (timestamp: number): string => {
    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
};

/**
 * The one place the app admits it's showing cached data.
 *
 * Rendered above content rather than replacing it: the whole point of the cache is
 * that stale bus timings are useful and an error screen is not. The age matters more
 * than the fact of being offline — "3h ago" tells someone whether to trust it.
 */
const OfflineNotice: React.FC<OfflineNoticeProps> = ({ visible, lastUpdatedAt }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    if (!visible) return null;

    const age = lastUpdatedAt ? ` · updated ${formatRelativeAge(lastUpdatedAt)}` : '';

    return (
        <View style={styles.banner}>
            <WifiOff size={14} color={theme.colors.textSecondary} />
            <Text style={styles.text} numberOfLines={1}>
                Offline — showing saved data{age}
            </Text>
        </View>
    );
};

export default OfflineNotice;

const getStyles = ({ colors, radius, spacing }: any) =>
    StyleSheet.create({
        banner: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.md,
            backgroundColor: colors.surface || 'rgba(127,127,127,0.12)',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
        },
        text: {
            flex: 1,
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: '500',
        },
    });
