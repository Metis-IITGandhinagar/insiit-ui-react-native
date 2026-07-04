import React from "react";
import { View } from "react-native";

import { Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

import { MealStatus } from "../types";

type Props = {
    status: MealStatus;
};

export function MealStatusChip({
    status,
}: Props) {
    const { colors, spacing, radius } = useTheme();

    const config = {
        upcoming: {
            label: "Upcoming",
            backgroundColor: colors.warning,
        },
        ongoing: {
            label: "Now Serving",
            backgroundColor: colors.success,
        },
        completed: {
            label: "Completed",
            backgroundColor: colors.border,
        },
    }[status];

    return (
        <View
            style={{
                alignSelf: "flex-start",
                backgroundColor: config.backgroundColor,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: radius.full,
            }}
        >
            <Text
                variant="caption"
                style={{
                    color: colors.surface,
                }}
            >
                {config.label}
            </Text>
        </View>
    );
}