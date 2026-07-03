import { useTheme } from "@/theme/useTheme";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
} from "react-native";


type ButtonProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export function Button({
    title,
    onPress,
    loading = false,
    disabled = false,
}: ButtonProps) {
    const { colors, spacing, radius, typography } = useTheme();

    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: isDisabled
                        ? colors.border
                        : colors.primary,
                    paddingVertical: spacing.md,
                    borderRadius: radius.lg,
                },
                pressed && { opacity: 0.9 },
            ]}
        >
            {loading ? (
                <ActivityIndicator color={colors.white} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: colors.white,
                            fontSize: typography.fontSize.md,
                            fontWeight: typography.fontWeight.semibold,
                        },
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        textAlign: "center",
    },
});