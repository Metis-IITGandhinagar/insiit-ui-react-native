import React from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "../ui";
import { useTheme } from "../../theme";

type Props = {
    title: string;
    subtitle?: string;
};

export function AppHeader({
    title,
    subtitle,
}: Props) {
    const { spacing } = useTheme();

    return (
        <View
            style={{
                marginBottom: spacing.lg,
            }}
        >
            <Text variant="title">{title}</Text>

            {subtitle ? (
                <Text
                    variant="caption"
                    style={{
                        marginTop: spacing.xs,
                    }}
                >
                    {subtitle}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({});