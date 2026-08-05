import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, Bell, LogOut, Trash2, Smartphone } from "lucide-react-native";

import { useTheme } from "../../../core/theme";
import { themeOptions, ThemeMode } from "../../../core/theme/colors";
import { Card } from "../../../shared/components/Card";
import { useAuth } from "../../../core/auth/useAuth";

const SettingsScreen = () => {
    const theme = useTheme();
    const { themeKey, setThemeKey, colors } = theme;
    const { signOut } = useAuth();

    // Hooks into the device hardware safe zones (notches, islands, home bars)
    const insets = useSafeAreaInsets();

    // Local states for preferences
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    // Pass insets to the styles function for dynamic padding calculation
    const styles = getStyles(theme, insets);

    const handleClearCache = () => {
        Alert.alert(
            "Clear Cache",
            "This will clear temporary schedules and offline images. Proceed?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: () => { } },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out of INSIIT?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: () => signOut() },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
                translucent
            />

            <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>

                {/* Appearance & Theme */}
                <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Appearance & Theme</Text>
                <View style={styles.themeGrid}>
                    {themeOptions.map((option) => {
                        const isSelected = themeKey === option.id;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.themeCard,
                                    { backgroundColor: option.previewBg, borderColor: isSelected ? option.primaryColor : colors.border },
                                    isSelected && styles.themeCardSelected,
                                ]}
                                onPress={() => setThemeKey(option.id as ThemeMode)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.themeHeader}>
                                    <View style={[styles.colorBubble, { backgroundColor: option.primaryColor }]} />
                                    {isSelected && (
                                        <View style={[styles.checkBadge, { backgroundColor: option.primaryColor }]}>
                                            <Check size={12} color="#FFFFFF" />
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.themeLabel, { color: option.isDark ? "#FFFFFF" : "#0F172A" }]}>
                                    {option.label}
                                </Text>
                                <Text style={[styles.themeDesc, { color: option.isDark ? "#94A3B8" : "#64748B" }]} numberOfLines={2}>
                                    {option.description}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* App Preferences */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <Card style={styles.cardPaddingOverride}>
                    <View style={styles.rowItem}>
                        <View style={styles.rowLeft}>
                            <Bell size={20} color={colors.primary} style={styles.rowIcon} />
                            <View>
                                <Text style={styles.rowTitle}>Notifications</Text>
                                <Text style={styles.rowSubtitle}>Announcements Updates</Text>
                            </View>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.rowItem}>
                        <View style={styles.rowLeft}>
                            <Smartphone size={20} color={colors.primary} style={styles.rowIcon} />
                            <View>
                                <Text style={styles.rowTitle}>Haptic Feedback</Text>
                                <Text style={styles.rowSubtitle}>Vibrate on tab swipe & actions</Text>
                            </View>
                        </View>
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={setHapticsEnabled}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </Card>

                {/* System & Storage */}
                <Text style={styles.sectionTitle}>System & Storage</Text>
                <Card style={styles.cardPaddingOverride}>
                    <TouchableOpacity style={styles.rowItem} onPress={handleClearCache} activeOpacity={0.7}>
                        <View style={styles.rowLeft}>
                            <Trash2 size={20} color={colors.danger} style={styles.rowIcon} />
                            <View>
                                <Text style={[styles.rowTitle, { color: colors.danger }]}>Clear Cache</Text>
                                <Text style={styles.rowSubtitle}>Free up local offline storage</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.rowItem} onPress={handleLogout} activeOpacity={0.7}>
                        <View style={styles.rowLeft}>
                            <LogOut size={20} color={colors.danger} style={styles.rowIcon} />
                            <View>
                                <Text style={[styles.rowTitle, { color: colors.danger }]}>Sign Out</Text>
                                <Text style={styles.rowSubtitle}>Log out of your @iitgn.ac.in account</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card>

            </ScrollView>
        </View>
    );
};

export default SettingsScreen;

const getStyles = ({ colors, spacing, radius }: any, insets: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentScroll: {
        paddingHorizontal: spacing.lg,
        // Calculate safe top padding (accommodates notches and status bars)
        paddingTop: Math.max(insets.top, spacing.lg),
        // Calculate safe bottom padding (accommodates home bars and floating navs)
        paddingBottom: insets.bottom + spacing.xxxl + 60,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    themeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.md,
    },
    themeCard: {
        width: "47.5%",
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 2,
        minHeight: 110,
        justifyContent: "space-between",
    },
    themeCardSelected: {
        borderWidth: 2,
    },
    themeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    colorBubble: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    checkBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    themeLabel: {
        fontSize: 15,
        fontWeight: "bold",
        marginTop: spacing.xs,
    },
    themeDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
    cardPaddingOverride: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: "hidden",
    },
    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    rowIcon: {
        marginRight: spacing.md,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    rowSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.lg + 28,
        marginRight: spacing.lg,
    },
});