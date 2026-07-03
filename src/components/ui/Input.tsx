import { useTheme } from "@/theme/useTheme";
import React from "react";
import {
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";

export function Input(props: TextInputProps) {
    const { colors, spacing, radius, typography } = useTheme();

    return (
        <TextInput
            placeholderTextColor={colors.textSecondary}
            style={[
                styles.input,
                {
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: radius.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    color: colors.text,
                    fontSize: typography.fontSize.md,
                },
            ]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {},
});