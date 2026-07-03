import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

import { Card, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

type Props = {
    title: string;
    icon: LucideIcon;
    onPress: () => void;
};

export function QuickActionItem({
    title,
    icon: Icon,
    onPress,
}: Props) {
    const { colors, spacing } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={styles.pressable}
        >
            <Card>
                <View
                    style={[
                        styles.content,
                        {
                            gap: spacing.sm,
                        },
                    ]}
                >
                    <Icon
                        size={28}
                        color={colors.primary}
                    />

                    <Text variant="caption">
                        {title}
                    </Text>
                </View>
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: "48%",
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
    },
});