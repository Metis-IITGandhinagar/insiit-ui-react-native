import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    StyleProp,
    ViewStyle,
} from "react-native";

import { useTheme } from "@/theme";

interface CardProps {
    children: React.ReactNode;
    /** Renders as a TouchableOpacity when provided. */
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    /** Override the default padding (layout.cardPadding). */
    padding?: number;
}

/**
 * Standard surface card: one radius, one padding, one shadow across the app.
 * Pass `style` for per-card tweaks (never re-declare radius/shadow inline).
 */
const Card = ({ children, onPress, style, padding }: CardProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const paddingStyle =
        padding !== undefined ? { padding } : null;

    if (onPress) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                style={[styles.card, paddingStyle, style]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, paddingStyle, style]}>{children}</View>;
};

export default Card;

const getStyles = ({ colors, shadows, layout }: any) =>
    StyleSheet.create({
        card: {
            backgroundColor: colors.surface,
            borderRadius: layout.cardRadius,
            padding: layout.cardPadding,
            ...shadows.card,
        },
    });
