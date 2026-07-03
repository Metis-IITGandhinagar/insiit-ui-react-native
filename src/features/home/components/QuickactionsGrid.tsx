import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../../../components/ui";
import { useTheme } from "../../../theme";
import { QuickActionItem } from "./QuickActionItem";
import { QuickAction } from "../types";
import { MainTabNavigationProp } from "../../../navigation/types";

interface Props {
    actions: QuickAction[];
}

export function QuickActionsGrid({ actions }: Props) {
    const { spacing } = useTheme();

    const navigation = useNavigation<MainTabNavigationProp>();

    const handlePress = (action: QuickAction) => {
        switch (action.id) {
            case "mess":
                navigation.navigate("Services");
                break;

            case "bus":
                navigation.navigate("Buses");
                break;

            case "outlets":
                navigation.navigate("Outlets");
                break;

            case "services":
                navigation.navigate("Services");
                break;

            case "events":
                navigation.navigate("Home");
                break;

            case "qr":
                navigation.navigate("More");
                break;

            case "timetable":
                navigation.navigate("More");
                break;

            case "more":
                navigation.navigate("More");
                break;
        }
    };

    return (
        <View
            style={{
                marginTop: spacing.lg,
            }}
        >
            <Text
                variant="subtitle"
                style={{
                    marginBottom: spacing.md,
                }}
            >
                Quick Actions
            </Text>

            <View
                style={[
                    styles.grid,
                    {
                        gap: spacing.md,
                    },
                ]}
            >
                {actions.map((action) => (
                    <QuickActionItem
                        key={action.id}
                        title={action.title}
                        icon={action.icon}
                        onPress={() => handlePress(action)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
});