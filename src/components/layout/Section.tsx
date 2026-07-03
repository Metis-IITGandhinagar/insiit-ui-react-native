import React, { PropsWithChildren } from "react";
import { View } from "react-native";

import { Text } from "../ui";
import { useTheme } from "../../theme";

type Props = PropsWithChildren<{
    title: string;
}>;

export function Section({
    title,
    children,
}: Props) {
    const { spacing } = useTheme();

    return (
        <View
            style={{
                marginBottom: spacing.xl,
            }}
        >
            <Text
                variant="subtitle"
                style={{
                    marginBottom: spacing.md,
                }}
            >
                {title}
            </Text>

            {children}
        </View>
    );
}