import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BusFront } from "lucide-react-native";
import { BusRoute } from "../services/busTypes";
import { useTheme } from "@/core/theme";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
    routes: BusRoute[];
    selected: BusRoute | null;
    onSelect: (route: BusRoute) => void;
}


const BusRouteTabs: React.FC<Props> = ({ routes, selected, onSelect }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    if (routes.length === 0) return null;

    const solo = routes.length === 1;

    const pills = routes.map((route) => {
        const active = solo || selected === route;

        return (
            <TouchableOpacity
                key={route}
                activeOpacity={0.85}
                disabled={solo}
                onPress={() => onSelect(route)}
                style={[styles.pill, active ? styles.activePill : styles.idlePill]}
            >
                <BusFront
                    size={15}
                    color={active ? colors.primary : colors.textSecondary}
                    strokeWidth={2.4}
                />

                <Text
                    numberOfLines={1}
                    style={[styles.pillText, active ? styles.activePillText : styles.idlePillText]}
                >
                    {route}
                </Text>
            </TouchableOpacity>
        );
    });
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            directionalLockEnabled
            overScrollMode="always"
            nestedScrollEnabled={true}
            style={styles.scroller}
            contentContainerStyle={styles.row}
            hitSlop={{ top: 10, bottom: 10 }}
        >
            <Text style={styles.label}>Route</Text>
            {pills}
        </ScrollView>
    );
};

export default BusRouteTabs;

const getStyles = ({ colors, radius, spacing, typography }: any) => StyleSheet.create({
    scroller: {
        marginHorizontal: -spacing.lg,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical:0,
    },

    label: {
        ...typography.label,
        fontSize: 12,
        color: colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: radius.round,
        borderWidth: 1,
    },

    activePill: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primaryLight,
    },

    idlePill: {
        backgroundColor: "transparent",
        borderColor: colors.border,
    },

    pillText: {
        ...typography.caption,
        fontWeight: "800",
        letterSpacing: 0.4,
    },

    activePillText: {
        color: colors.primary,
    },

    idlePillText: {
        color: colors.textSecondary,
    },
});
