import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Sparkles, User, Settings } from "lucide-react-native";
import { Card } from "@/shared/components/Card";
import { useTheme } from "@/core/theme";

const ProfileHeroCard = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <Card style={styles.cardContainer}>
            <View style={styles.headerRow}>
                <View style={styles.iconWrapper}>
                    <Sparkles size={28} color={colors.primary} />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>INSIIT</Text>
                    <Text style={styles.subtitle}>Connecting IIT Gandhinagar</Text>
                </View>
            </View>

            <Text style={styles.description}>
                Everything you need on campus in one place.
            </Text>

            <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.button, styles.primaryButton]} activeOpacity={0.8}>
                    <User size={18} color="#FFFFFF" />
                    <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.secondaryButton]} activeOpacity={0.8}>
                    <Settings size={18} color={colors.primary} />
                    <Text style={[styles.buttonText, { color: colors.primary }]}>Settings</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

export default ProfileHeroCard;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    cardContainer: {
        marginBottom: spacing.md,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: `${colors.primary}15`, // Light primary background
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    description: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    actionRow: {
        flexDirection: "row",
        gap: spacing.md,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: radius.md,
        gap: spacing.sm,
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: `${colors.primary}30`,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "600",
    }
});