import { useTheme } from "@/theme/useTheme";
import React, { PropsWithChildren } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";


type Props = PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: Props) {
    const { colors, radius, spacing, shadows } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...shadows.sm,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {},
});