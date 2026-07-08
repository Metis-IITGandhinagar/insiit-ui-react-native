import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    CalendarDays,
    ChevronDown,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const months = [
    "January 2026",
    "February 2026",
    "March 2026",
    "April 2026",
    "May 2026",
    "June 2026",
    "July 2026",
    "August 2026",
    "September 2026",
    "October 2026",
    "November 2026",
    "December 2026",
];

const MonthSelector = () => {
    const [selectedMonth] = useState("July 2026");

    return (
        <View style={styles.card}>
            <Text style={styles.label}>
                MENU MONTH
            </Text>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.selector}
            >
                <View style={styles.left}>
                    <CalendarDays
                        size={20}
                        color={colors.primary}
                    />

                    <Text style={styles.month}>
                        {selectedMonth}
                    </Text>
                </View>

                <ChevronDown
                    size={20}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            <Text style={styles.helper}>
                Choose the month for which this menu will be published.
            </Text>
        </View>
    );
};

export default MonthSelector;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 4,
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        color: colors.primary,
        marginBottom: spacing.md,
    },

    selector: {
        height: 56,

        borderRadius: radius.lg,

        borderWidth: 1,
        borderColor: "#E5E7EB",

        paddingHorizontal: spacing.md,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    month: {
        marginLeft: spacing.sm,
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },

    helper: {
        marginTop: spacing.sm,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});