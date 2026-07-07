import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    UserRound,
    Settings,
    Sparkles,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const UserCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.top}>
                <View style={styles.logoCircle}>
                    <Sparkles
                        size={30}
                        color={colors.primary}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={styles.title}>
                        INSIIT
                    </Text>

                    <Text style={styles.subtitle}>
                        Connecting IIT Gandhinagar
                    </Text>
                </View>
            </View>

            <Text style={styles.description}>
                Everything you need on campus in one place.
            </Text>

            <View style={styles.buttons}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.primaryButton}
                >
                    <UserRound
                        size={18}
                        color="#FFFFFF"
                    />

                    <Text style={styles.primaryText}>
                        Profile
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.secondaryButton}
                >
                    <Settings
                        size={18}
                        color={colors.primary}
                    />

                    <Text style={styles.secondaryText}>
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UserCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: 22,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },

        elevation: 5,
    },

    top: {
        flexDirection: "row",
        alignItems: "center",
    },

    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,

        backgroundColor: "#EEF4FF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.md,
    },

    info: {
        flex: 1,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        color: colors.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: colors.textSecondary,
    },

    description: {
        marginTop: 20,
        fontSize: 15,
        lineHeight: 22,
        color: colors.textSecondary,
    },

    buttons: {
        flexDirection: "row",
        marginTop: 24,
    },

    primaryButton: {
        flex: 1,

        height: 48,

        borderRadius: 16,

        backgroundColor: colors.primary,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.sm,
    },

    secondaryButton: {
        flex: 1,

        height: 48,

        borderRadius: 16,

        backgroundColor: "#EEF4FF",

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    primaryText: {
        color: "#FFFFFF",
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "700",
    },

    secondaryText: {
        color: colors.primary,
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "700",
    },
});