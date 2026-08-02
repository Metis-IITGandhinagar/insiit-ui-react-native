// src/features/more/screens/ProfileScreen.tsx
import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Image, TextInput } from "react-native";
import { Lock, Mail, User as UserIcon, Info } from "lucide-react-native";

import { useTheme } from "../../../core/theme";
import { Card } from "../../../shared/components/Card";
import { useAuth } from "../../../core/auth/useAuth";

const ProfileScreen = () => {
    const { user } = useAuth() as any;
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const providerData = user?.providerData?.[0] || {};
    const displayName = user?.displayName || "Google User";
    const email = user?.email || "user@iitgn.ac.in";
    const photoURL = user?.photoURL;

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>

                    {/* Profile Picture Section */}
                    <View style={styles.avatarContainer}>
                        {photoURL ? (
                            <Image source={{ uri: photoURL }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <UserIcon size={40} color={colors.textSecondary} />
                            </View>
                        )}
                        <View style={styles.lockBadge}>
                            <Lock size={12} color="#FFFFFF" />
                        </View>
                    </View>

                    {/* Form Fields */}
                    <Card style={styles.card}>
                        <View style={styles.infoRow}>
                            <Info size={16} color={colors.textSecondary} style={styles.infoIcon} />
                            <Text style={styles.infoText}>
                                Profile details are fetched directly from your authenticated Google Account and cannot be edited here.
                            </Text>
                        </View>

                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <UserIcon size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={displayName}
                                editable={false}
                            />
                            <Lock size={18} color={colors.textSecondary} style={styles.lockIcon} />
                        </View>

                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                editable={false}
                            />
                            <Lock size={18} color={colors.textSecondary} style={styles.lockIcon} />
                        </View>
                    </Card>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default ProfileScreen;

const getStyles = ({ colors, spacing, radius }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || "#F2F4F7",
    },
    contentScroll: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
    },
    headerContainer: {
        marginBottom: spacing.xl,
        alignItems: "center",
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 4,
    },
    screenSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    avatarContainer: {
        alignSelf: "center",
        marginBottom: spacing.xl,
        marginTop:spacing.xxxl,
        position: "relative",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surface,
        borderWidth: 3,
        borderColor: colors.border || "#E5E7EB",
    },
    avatarPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E5E7EB",
    },
    lockBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.textSecondary || "#65676B",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.surface || "#FFFFFF",
    },
    card: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },
    infoRow: {
        flexDirection: "row",
        backgroundColor: `${colors.primary}15`,
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.lg,
    },
    infoIcon: {
        marginTop: 2,
        marginRight: spacing.sm,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6", // Grayed out background
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: "#E5E7EB", // Subtle locked border
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        height: 52,
    },
    inputIcon: {
        marginRight: spacing.md,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textSecondary, // Grayed out text color
    },
    lockIcon: {
        marginLeft: spacing.sm,
        opacity: 0.6,
    },
});