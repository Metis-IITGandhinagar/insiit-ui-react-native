import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";

import { useTheme } from "@/theme";

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    /** Optional action element rendered on the right (e.g. a button). */
    right?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

/**
 * Standard screen header: left-aligned title + subtitle, theme-driven colors
 * (adapts to dark mode), consistent spacing across every screen.
 */
const ScreenHeader = ({ title, subtitle, right, style }: ScreenHeaderProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.titleBlock}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            {right ? <View style={styles.right}>{right}</View> : null}
        </View>
    );
};

export default ScreenHeader;

const getStyles = ({ colors }: any) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        titleBlock: {
            flex: 1,
        },
        title: {
            fontSize: 30,
            fontWeight: "800",
            color: colors.text,
        },
        subtitle: {
            marginTop: 4,
            fontSize: 15,
            fontWeight: "500",
            color: colors.textSecondary,
        },
        right: {
            marginLeft: 16,
        },
    });
