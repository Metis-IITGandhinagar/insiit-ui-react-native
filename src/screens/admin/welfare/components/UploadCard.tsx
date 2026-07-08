import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Upload,
    FileText,
    Image,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const UploadCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>
                MENU FILE
            </Text>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.uploadArea}
            >
                <View style={styles.iconCircle}>
                    <Upload
                        size={30}
                        color={colors.primary}
                    />
                </View>

                <Text style={styles.title}>
                    Upload Menu
                </Text>

                <Text style={styles.subtitle}>
                    PDF or Image
                </Text>

                <Text style={styles.helper}>
                    Tap to choose a file
                </Text>
            </TouchableOpacity>

            <View style={styles.supported}>
                <View style={styles.fileType}>
                    <FileText
                        size={18}
                        color="#DC2626"
                    />

                    <Text style={styles.fileText}>
                        PDF
                    </Text>
                </View>

                <View style={styles.fileType}>
                    <Image
                        size={18}
                        color="#16A34A"
                    />

                    <Text style={styles.fileText}>
                        JPG / PNG
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default UploadCard;

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

    uploadArea: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#CBD5E1",

        borderRadius: radius.xl,

        alignItems: "center",

        paddingVertical: 36,
    },

    iconCircle: {
        width: 64,
        height: 64,

        borderRadius: 32,

        backgroundColor: "#EEF4FF",

        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        marginTop: spacing.md,
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: colors.textSecondary,
    },

    helper: {
        marginTop: spacing.sm,
        fontSize: 13,
        color: "#94A3B8",
    },

    supported: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.lg,
        gap: spacing.xl,
    },

    fileType: {
        flexDirection: "row",
        alignItems: "center",
    },

    fileText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: "600",
        color: colors.textSecondary,
    },
});