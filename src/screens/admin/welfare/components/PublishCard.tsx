import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    CircleAlert,
    Upload,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const PublishCard = () => {
    const publishMenu = () => {
        Alert.alert(
            "Publish Menu",
            "The July 2026 menu will become immediately available to all students.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Publish",
                    onPress: () => {
                        // TODO:
                        // Upload menu to backend
                        // Invalidate cache
                        // Refresh Home screen
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <View style={styles.warning}>
                <CircleAlert
                    size={18}
                    color="#D97706"
                />

                <Text style={styles.warningText}>
                    Publishing replaces the existing menu for this month.
                </Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.button}
                onPress={publishMenu}
            >
                <Upload
                    size={20}
                    color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                    Publish Menu
                </Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
                Students will see the updated menu instantly.
            </Text>
        </View>
    );
};

export default PublishCard;

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

    warning: {
        flexDirection: "row",
        alignItems: "flex-start",

        backgroundColor: "#FEF3C7",

        borderRadius: radius.lg,

        padding: spacing.md,
    },

    warningText: {
        flex: 1,

        marginLeft: spacing.sm,

        color: "#92400E",

        fontSize: 14,

        lineHeight: 20,
    },

    button: {
        marginTop: spacing.lg,

        height: 56,

        backgroundColor: colors.primary,

        borderRadius: radius.lg,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",
    },

    buttonText: {
        marginLeft: spacing.sm,

        color: "#FFFFFF",

        fontSize: 16,

        fontWeight: "700",
    },

    footer: {
        marginTop: spacing.md,

        textAlign: "center",

        color: colors.textSecondary,

        fontSize: 13,
    },
});