import React from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/useTheme";

export function Divider() {
    const { colors } = useTheme();

    return (
        <View
            style={{
                height: 1,
                backgroundColor: colors.border,
            }}
        />
    );
}