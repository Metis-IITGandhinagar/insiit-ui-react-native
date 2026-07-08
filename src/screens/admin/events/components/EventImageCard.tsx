import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    ImagePlus,
    Upload,
    Trash2,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const EventImageCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <ImagePlus
                    size={22}
                    color={colors.primary}
                />

                <Text style={styles.title}>
                    Event Banner
                </Text>
            </View>

            <Text style={styles.subtitle}>
                Upload a cover image for the event.
            </Text>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.uploadArea}
            >
                <ImagePlus
                    size={42}
                    color={colors.primary}
                />

                <Text style={styles.uploadTitle}>
                    Upload Image
                </Text>

                <Text style={styles.uploadSubtitle}>
                    JPG • PNG • WEBP
                </Text>

                <Text style={styles.helper}>
                    Recommended: 1200 × 630 px
                </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.primaryButton}
                >
                    <Upload
                        size={18}
                        color="#FFFFFF"
                    />

                    <Text style={styles.primaryText}>
                        Choose Image
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.secondaryButton}
                >
                    <Trash2
                        size={18}
                        color="#DC2626"
                    />

                    <Text style={styles.secondaryText}>
                        Remove
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EventImageCard;

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

    uploadArea: {
        height: 220,

        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#CBD5E1",

        borderRadius: radius.xl,

        justifyContent: "center",
        alignItems: "center",
    },

    uploadTitle: {
        marginTop: spacing.md,

        fontSize: 18,
        fontWeight: "700",

        color: colors.text,
    },

    uploadSubtitle: {
        marginTop: 6,

        fontSize: 14,

        color: colors.textSecondary,
    },

    helper: {
        marginTop: spacing.sm,

        fontSize: 13,

        color: "#94A3B8",
    },

    actions: {
        flexDirection: "row",

        marginTop: spacing.lg,
    },

    primaryButton: {
        flex: 1,

        height: 50,

        backgroundColor: colors.primary,

        borderRadius: radius.lg,

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",

        marginRight: spacing.sm,
    },

    secondaryButton: {
        flex: 1,

        height: 50,

        backgroundColor: "#FEE2E2",

        borderRadius: radius.lg,

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",
    },

    primaryText: {
        marginLeft: spacing.sm,
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },

    secondaryText: {
        marginLeft: spacing.sm,
        color: "#DC2626",
        fontWeight: "700",
        fontSize: 15,
    },
});