import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Ellipsis,
    Bell,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const MoreHeader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.iconContainer}>
                    <Ellipsis
                        size={24}
                        color={colors.primary}
                        strokeWidth={2.2}
                    />
                </View>

                <View>
                    <Text style={styles.title}>
                        More
                    </Text>

                    <Text style={styles.subtitle}>
                        Account, campus & app settings
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.notificationButton}
            >
                <Bell
                    size={21}
                    color={colors.text}
                    strokeWidth={2}
                />
            </TouchableOpacity>
        </View>
    );
};

export default MoreHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: radius.round,
        backgroundColor: colors.surface,

        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.md,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 15,
        fontWeight: "500",
        color: colors.textSecondary,
    },

    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: radius.round,
        backgroundColor: colors.surface,

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },
});