import { useTheme } from "@/theme/useTheme";
import React from "react";
import {
    Text as RNText,
    TextProps,
} from "react-native";

type Variant =
    | "body"
    | "title"
    | "subtitle"
    | "caption";

interface Props extends TextProps {
    variant?: Variant;
}

export function Text({
    variant = "body",
    style,
    ...props
}: Props) {
    const { colors, typography } = useTheme();

    const variants = {
        body: {
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.regular,
        },
        title: {
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.bold,
        },
        subtitle: {
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.medium,
        },
        caption: {
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.regular,
        },
    };

    return (
        <RNText
            {...props}
            style={[
                {
                    color: colors.text,
                },
                variants[variant],
                style,
            ]}
        />
    );
}