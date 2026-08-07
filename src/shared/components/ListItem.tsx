// src/shared/components/ListItem.tsx
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@core/theme";

interface ListItemProps {
    leadingIcon: React.ReactNode;
    title: string;
    subtitle?: string;
    /** Omit for a purely informational row — it then renders as non-tappable. */
    onPress?: () => void;
    showChevron?: boolean;
    showDivider?: boolean;
    trailingElement?: React.ReactNode; 
}

export const ListItem: React.FC<ListItemProps> = ({
    leadingIcon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    showDivider = false,
    trailingElement,
}) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                disabled={!onPress}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>{leadingIcon}</View>

                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </View>

                {/* Dynamic Action Trailing Block */}
                {trailingElement ? (
                    <View style={styles.trailingContainer}>{trailingElement}</View>
                ) : (
                    showChevron && (
                        <ChevronRight size={18} color={colors.textSecondary || "#65676b"} style={styles.chevron} />
                    )
                )}
            </TouchableOpacity>
            {showDivider && <View style={styles.divider} />}
        </View>
    );
};

const getStyles = ({ colors, spacing, typography }: any) =>
    StyleSheet.create({
        wrapper: {
            width: "100%",
        },
        container: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: spacing.md || 12,
            paddingHorizontal: spacing.lg || 16,
        },
        iconContainer: {
            marginRight: spacing.md || 12,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        },
        textContainer: {
            flex: 1,
            justifyContent: "center",
            marginRight: spacing.sm || 8,
        },
        title: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.text || "#1c1e21",
        },
        subtitle: {
            fontSize: 13,
            color: colors.textSecondary || "#65676b",
            marginTop: 2,
        },
        chevron: {
            flexShrink: 0,
            opacity: 0.8,
        },
        trailingContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
        divider: {
            height: 1,
            backgroundColor: colors.border || "#e4e6eb",
            marginLeft: (spacing.lg || 16) + 36,
            marginRight: spacing.lg || 16,
        },
    });