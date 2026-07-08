import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Eye,
    Save,
    Send,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const EventPublishCard = () => {
    const saveDraft = () => {
        Alert.alert("Draft Saved");
    };

    const preview = () => {
        Alert.alert("Preview Event");
    };

    const publish = () => {
        Alert.alert(
            "Publish Event",
            "This event will immediately appear in the Events section for all students.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Publish",
                },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.heading}>
                Publish
            </Text>

            <Text style={styles.subtitle}>
                Review your event before publishing.
            </Text>

            <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={saveDraft}
            >
                <Save
                    size={18}
                    color={colors.primary}
                />

                <Text style={styles.secondaryText}>
                    Save Draft
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={preview}
            >
                <Eye
                    size={18}
                    color={colors.primary}
                />

                <Text style={styles.secondaryText}>
                    Preview
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.9}
                onPress={publish}
            >
                <Send
                    size={18}
                    color="#FFFFFF"
                />

                <Text style={styles.primaryText}>
                    Publish Event
                </Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
                Published events become visible immediately in the Explore page.
            </Text>
        </View>
    );
};

export default EventPublishCard;

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

    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
        fontSize: 14,
        color: colors.textSecondary,
    },

    secondaryButton: {
        height: 52,

        borderRadius: radius.lg,

        backgroundColor: "#EEF4FF",

        flexDirection: "row",

        justifyContent: "center",
        alignItems: "center",

        marginBottom: spacing.md,
    },

    secondaryText: {
        marginLeft: spacing.sm,
        color: colors.primary,
        fontWeight: "700",
        fontSize: 15,
    },

    primaryButton: {
        height: 56,

        borderRadius: radius.lg,

        backgroundColor: colors.primary,

        flexDirection: "row",

        justifyContent: "center",
        alignItems: "center",
    },

    primaryText: {
        marginLeft: spacing.sm,
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },

    footer: {
        marginTop: spacing.md,
        textAlign: "center",
        color: colors.textSecondary,
        fontSize: 13,
    },
});