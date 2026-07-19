import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BusType } from "../services/busTypes";
import { useTheme } from "@/core/theme";

interface Props {
    selected: BusType;
    onSelect: (tab: BusType) => void;
}

const BusTypeTabs: React.FC<Props> = ({ selected, onSelect }) => {
    const tabs: BusType[] = ["56", "29", "EECO"];

    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const active = selected === tab;

                return (
                    <TouchableOpacity
                        key={tab}
                        activeOpacity={0.85}
                        style={[
                            styles.tab,
                            active && styles.activeTab,
                        ]}
                        onPress={() => onSelect(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                active && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BusTypeTabs;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.xs,
        flexDirection: "row",
        ...shadows.card,
    },

    tab: {
        flex: 1,
        height: 46,
        borderRadius: radius.md,
        justifyContent: "center",
        alignItems: "center",
    },

    activeTab: {
        backgroundColor: colors.primary,
    },

    tabText: {
        ...typography.body,
        fontWeight: "700",
        color: colors.textSecondary,
    },

    activeTabText: {
        color: colors.surface,
    },
});