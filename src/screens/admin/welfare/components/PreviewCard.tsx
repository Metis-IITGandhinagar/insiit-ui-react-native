import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    Eye,
    CircleCheck,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const meals = [
    {
        name: "Breakfast",
        menu: "Poha, Tea, Banana",
    },
    {
        name: "Lunch",
        menu: "Paneer Butter Masala +4 items",
    },
    {
        name: "Snacks",
        menu: "Samosa, Tea",
    },
    {
        name: "Dinner",
        menu: "Veg Biryani +3 items",
    },
];

const PreviewCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Eye
                    size={22}
                    color={colors.primary}
                />

                <Text style={styles.title}>
                    Preview
                </Text>
            </View>

            <Text style={styles.subtitle}>
                Verify today's extracted menu before publishing.
            </Text>

            <View style={styles.previewCard}>
                <Text style={styles.day}>
                    Monday
                </Text>

                {meals.map((meal) => (
                    <View
                        key={meal.name}
                        style={styles.row}
                    >
                        <Text style={styles.meal}>
                            {meal.name}
                        </Text>

                        <Text style={styles.menu}>
                            {meal.menu}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.success}>
                <CircleCheck
                    size={18}
                    color="#16A34A"
                />

                <Text style={styles.successText}>
                    Menu extracted successfully
                </Text>
            </View>
        </View>
    );
};

export default PreviewCard;

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

    header: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        marginLeft: spacing.sm,
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
        color: colors.textSecondary,
        fontSize: 14,
    },

    previewCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: radius.lg,
        padding: spacing.md,
    },

    day: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: spacing.md,
    },

    row: {
        marginBottom: spacing.md,
    },

    meal: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text,
    },

    menu: {
        marginTop: 3,
        fontSize: 14,
        color: colors.textSecondary,
    },

    success: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.lg,
    },

    successText: {
        marginLeft: spacing.sm,
        color: "#16A34A",
        fontWeight: "600",
        fontSize: 14,
    },
});