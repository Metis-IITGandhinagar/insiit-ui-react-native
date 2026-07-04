import React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Card, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

type Props = {
    days: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
};

export function DaySelector({
    days,
    selectedIndex,
    onSelect,
}: Props) {
    const { colors, spacing, radius } = useTheme();

    return (
        <Card
            style={{
                marginTop: spacing.lg,
            }}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View
                    style={{
                        flexDirection: "row",
                        gap: spacing.sm,
                    }}
                >
                    {days.map((day, index) => {
                        const selected = index === selectedIndex;

                        return (
                            <Pressable
                                key={day}
                                onPress={() => onSelect(index)}
                            >
                                <View
                                    style={{
                                        paddingHorizontal: spacing.md,
                                        paddingVertical: spacing.sm,
                                        borderRadius: radius.full,
                                        backgroundColor: selected
                                            ? colors.primary
                                            : colors.surface,
                                        borderWidth:1,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <Text
                                        variant="body"
                                        style={{
                                            color: selected
                                                ? colors.surface
                                                : colors.text,
                                        }}
                                    >
                                        {day.slice(0, 3)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </Card>
    );
}