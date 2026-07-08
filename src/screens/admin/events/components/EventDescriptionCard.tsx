import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { FileText } from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const EventDescriptionCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <FileText
                    size={22}
                    color={colors.primary}
                />

                <Text style={styles.title}>
                    Description
                </Text>
            </View>

            <Text style={styles.subtitle}>
                This will appear on the event page and search results.
            </Text>

            <TextInput
                multiline
                textAlignVertical="top"
                placeholder="Write a detailed description of the event..."
                placeholderTextColor="#94A3B8"
                style={styles.input}
            />

            <View style={styles.footer}>
                <Text style={styles.helper}>
                    Markdown supported later
                </Text>

                <Text style={styles.counter}>
                    0 / 1000
                </Text>
            </View>
        </View>
    );
};

export default EventDescriptionCard;

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

    input: {
        minHeight: 180,

        borderWidth: 1,

        borderColor: "#E5E7EB",

        borderRadius: radius.lg,

        padding: spacing.md,

        fontSize: 15,

        color: colors.text,
    },

    footer: {
        marginTop: spacing.sm,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",
    },

    helper: {
        color: colors.textSecondary,
        fontSize: 13,
    },

    counter: {
        color: "#94A3B8",
        fontSize: 13,
    },
});