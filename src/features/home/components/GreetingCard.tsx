import React from "react";
import { View } from "react-native";

import { Avatar, Card, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

type Props = {
    name?: string;
};

export function GreetingCard({
    name = "Student",
}: Props) {
    const { spacing } = useTheme();

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
                ? "Good Afternoon"
                : "Good Evening";

    return (
        <Card>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingRight: spacing.md,
                    }}
                >
                    <Text variant="caption">
                        {greeting}
                    </Text>

                    <Text
                        variant="title"
                        style={{
                            marginTop: spacing.xs,
                        }}
                    >
                        {name} 👋
                    </Text>

                    <Text
                        variant="body"
                        style={{
                            marginTop: spacing.sm,
                        }}
                    >
                        Welcome back to INSIIT.
                    </Text>
                </View>

                <Avatar />
            </View>
        </Card>
    );
}