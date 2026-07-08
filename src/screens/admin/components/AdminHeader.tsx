import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
    ArrowLeft,
    ShieldCheck,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const AdminHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <ArrowLeft
                    size={22}
                    color={colors.text}
                />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Admin Dashboard
                </Text>

                <Text style={styles.subtitle}>
                    Manage campus content
                </Text>
            </View>

            <View style={styles.iconCircle}>
                <ShieldCheck
                    size={22}
                    color={colors.primary}
                />
            </View>
        </View>
    );
};

export default AdminHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
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

    titleContainer: {
        flex: 1,
        marginHorizontal: spacing.md,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.text,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: colors.textSecondary,
    },

    iconCircle: {
        width: 48,
        height: 48,

        borderRadius: radius.round,

        backgroundColor: "#EEF4FF",

        justifyContent: "center",
        alignItems: "center",
    },
});