// src/features/more/screens/ProfileScreen.tsx
import React from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Info, Lock, Mail, User as UserIcon } from "lucide-react-native";

import { useTheme } from "@/core/theme";
import { Card } from "@/shared/components/Card";
import { useAuth } from "@/core/auth/useAuth";

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const displayName = user?.displayName || "IITGN Student";
    const email = user?.email || "";
    const photoURL = user?.photoURL;

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <ArrowLeft size={18} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.headerTextWrap}>
                        <Text style={styles.title}>Profile</Text>
                        <Text style={styles.subtitle}>Your INSIIT account details</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>

                    {/* Avatar + identity */}
                    <View style={styles.identityContainer}>
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

                        <Text style={styles.name}>{displayName}</Text>
                        {!!email && <Text style={styles.emailText}>{email}</Text>}
                    </View>

                    {/* Read-only details */}
                    <Card style={styles.card}>
                        <View style={styles.infoRow}>
                            <Info size={16} color={colors.textSecondary} style={styles.infoIcon} />
                            <Text style={styles.infoText}>
                                Profile details are fetched directly from your authenticated Google Account and cannot be edited here.
                            </Text>
                        </View>

                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.fieldWrapper}>
                            <UserIcon size={20} color={colors.textSecondary} style={styles.fieldIcon} />
                            <Text style={styles.fieldValue} numberOfLines={1}>{displayName}</Text>
                            <Lock size={18} color={colors.textSecondary} style={styles.lockIcon} />
                        </View>

                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.fieldWrapper}>
                            <Mail size={20} color={colors.textSecondary} style={styles.fieldIcon} />
                            <Text style={styles.fieldValue} numberOfLines={1}>{email || "—"}</Text>
                            <Lock size={18} color={colors.textSecondary} style={styles.lockIcon} />
                        </View>
                    </Card>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default ProfileScreen;

const getStyles = ({ colors, spacing, radius, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerTextWrap: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        ...typography.h2,
        color: colors.text,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 2,
    },
    contentScroll: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
    },
    identityContainer: {
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surface,
        borderWidth: 3,
        borderColor: colors.border,
    },
    avatarPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    lockBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.textSecondary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.surface,
    },
    name: {
        ...typography.h3,
        color: colors.text,
    },
    emailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
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
    fieldWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        height: 52,
    },
    fieldIcon: {
        marginRight: spacing.md,
    },
    fieldValue: {
        flex: 1,
        fontSize: 16,
        color: colors.textSecondary,
    },
    lockIcon: {
        marginLeft: spacing.sm,
        opacity: 0.6,
    },
});
