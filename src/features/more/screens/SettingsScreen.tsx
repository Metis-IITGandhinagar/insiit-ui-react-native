import React, { useState, useEffect } from "react";
import { AppState, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert, Switch, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Check, LogIn, LogOut } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { createMMKV } from "react-native-mmkv";

import { useTheme } from "../../../core/theme";
import { themeOptions, ThemePreference, SYSTEM_PREFERENCE } from "../../../core/theme/colors";
import { Card } from "../../../shared/components/Card";
import { useAuth } from "../../../core/auth/useAuth";
import { notificationService } from "@/features/notifications/services/notificationService";
import { setEventReminderPreference } from "@/features/notifications/services/pushRegistrationService";
import * as Notifications from 'expo-notifications';

const settingsStorage = createMMKV({ id: "insiit.settings" });
const EVENT_REMINDERS_KEY = "event_reminders_enabled";

const SettingsScreen = () => {
    const theme = useTheme();
    const { preference, setThemeKey, colors } = theme;
    const { signOut, isGuest } = useAuth();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const styles = getStyles(theme, insets);

    const [eventRemindersEnabled, setEventRemindersEnabled] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        const saved = settingsStorage.getBoolean(EVENT_REMINDERS_KEY);
        setEventRemindersEnabled(saved ?? true);
        const refreshPermission = () => {
            void Notifications.getPermissionsAsync()
                .then(({ status }) => setPermissionDenied(status !== 'granted'))
                .catch((error) => console.warn('Could not read notification permission:', error));
        };
        refreshPermission();
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') refreshPermission();
        });
        return () => subscription.remove();
    }, []);

    const selectedOption =
        themeOptions.find((option) => option.id === preference) ?? themeOptions[0];

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

    const handleToggleReminders = async (value: boolean) => {
        if (value) {
            const granted = await notificationService.requestPermissions();
            if (!granted) {
                setPermissionDenied(true);
                Alert.alert(
                    "Permission needed",
                    "Notifications are disabled for INSIIT. Enable them in your device settings to receive event updates.",
                    [
                        { text: "Not now", style: "cancel" },
                        { text: "Open Settings", onPress: () => void Linking.openSettings() },
                    ]
                );
                return;
            }
            setPermissionDenied(false);
        }
        try {
            await setEventReminderPreference(value);
            setEventRemindersEnabled(value);
            settingsStorage.set(EVENT_REMINDERS_KEY, value);
        } catch (error) {
            console.warn("Could not update event reminder preference:", error);
            Alert.alert("Could not update notifications", "Please check your connection and try again.");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
                {/* Appearance & Theme */}
                <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Appearance & Theme</Text>

                <View style={styles.themeSummary}>
                    <Text style={styles.themeSummaryName}>{selectedOption.label}</Text>
                    <Text style={styles.themeSummaryDesc}>
                        {preference === SYSTEM_PREFERENCE
                            ? `${selectedOption.description} — currently ${theme.isDark ? "dark" : "light"}`
                            : selectedOption.description}
                    </Text>
                </View>

                <View style={styles.swatchRow}>
                    {themeOptions.map((option) => {
                        const isSelected = preference === option.id;

                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={styles.swatchItem}
                                onPress={() => setThemeKey(option.id as ThemePreference)}
                                activeOpacity={0.8}
                                accessibilityRole="button"
                                accessibilityLabel={option.label}
                                accessibilityState={{ selected: isSelected }}
                            >
                                <View
                                    style={[
                                        styles.swatchRing,
                                        {
                                            borderColor: isSelected ? option.primaryColor : "transparent",
                                        },
                                    ]}
                                >
                                    <LinearGradient
                                        colors={option.swatch}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.swatch}
                                    >
                                        {isSelected && <Check size={20} color="#FFFFFF" strokeWidth={3} />}
                                    </LinearGradient>
                                </View>

                                <Text
                                    style={[
                                        styles.swatchLabel,
                                        isSelected && { color: colors.text, fontWeight: "700" },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Account */}
                <Text style={styles.sectionTitle}>Account</Text>
                <Card style={styles.cardPaddingOverride}>
                    {isGuest ? (
                        <TouchableOpacity
                            style={styles.rowItem}
                            onPress={() => navigation.navigate("Login")}
                            activeOpacity={0.7}
                        >
                            <View style={styles.rowLeft}>
                                <LogIn size={20} color={colors.primary} style={styles.rowIcon} />
                                <View>
                                    <Text style={[styles.rowTitle, { color: colors.primary }]}>Sign In</Text>
                                    <Text style={styles.rowSubtitle}>
                                        Post, bid and claim with your @iitgn.ac.in account
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.rowItem} onPress={handleLogout} activeOpacity={0.7}>
                            <View style={styles.rowLeft}>
                                <LogOut size={20} color={colors.danger} style={styles.rowIcon} />
                                <View>
                                    <Text style={[styles.rowTitle, { color: colors.danger }]}>Sign Out</Text>
                                    <Text style={styles.rowSubtitle}>Log out of your @iitgn.ac.in account</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </Card>

                {/* Notifications */}
                <Text style={styles.sectionTitle}>Notifications</Text>
                <Card style={styles.cardPaddingOverride}>
                    <View style={styles.rowItem}>
                        <View style={styles.rowLeft}>
                            <Bell size={20} color={colors.primary} style={styles.rowIcon} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitle}>Event reminders</Text>
                                <Text style={styles.rowSubtitle}>
                                    Get notified 10 min before events
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={eventRemindersEnabled}
                            onValueChange={handleToggleReminders}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                    {permissionDenied && (
                        <TouchableOpacity
                            style={{ paddingHorizontal: 16, paddingBottom: 14 }}
                            onPress={() => void Linking.openSettings()}
                            accessibilityRole="button"
                        >
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                Enable notifications in device settings
                            </Text>
                        </TouchableOpacity>
                    )}
                </Card>
            </ScrollView>
        </View>
    );
};

export default SettingsScreen;

const getStyles = ({ colors, spacing, radius }: any, insets: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        contentScroll: {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: insets.bottom + spacing.xxxl + 60,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.text,
            marginTop: spacing.lg,
            marginBottom: spacing.md,
        },
        themeSummary: {
            marginBottom: spacing.lg,
        },
        themeSummaryName: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.text,
        },
        themeSummaryDesc: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
        },
        swatchRow: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        swatchItem: {
            alignItems: "center",
            flex: 1,
            gap: spacing.sm,
        },
        swatchRing: {
            padding: 3,
            borderRadius: 999,
            borderWidth: 2,
        },
        swatch: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
        },
        swatchLabel: {
            fontSize: 11,
            fontWeight: "500",
            color: colors.textSecondary,
            textAlign: "center",
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
    });
