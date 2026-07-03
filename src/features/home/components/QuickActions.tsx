import React from "react";
import { View } from "react-native";

import { Button, Card, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

export function QuickActions() {
    const { spacing } = useTheme();

    return (
        <Card>
            <Text variant="subtitle">
                Quick Actions
            </Text>

            <View
                style={{
                    marginTop: spacing.md,
                    gap: spacing.sm,
                }}
            >
                <Button
                    title="Mess Menu"
                    onPress={() => { }}
                />

                <Button
                    title="Bus Schedule"
                    onPress={() => { }}
                />

                <Button
                    title="Dynamic QR"
                    onPress={() => { }}
                />
            </View>
        </Card>
    );
}