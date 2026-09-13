import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, LogIn, LogOut } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../../../core/theme";
import { themeOptions, ThemePreference, SYSTEM_PREFERENCE } from "../../../core/theme/colors";
import { Card } from "../../../shared/components/Card";
import { useAuth } from "../../../core/auth/useAuth";

const SettingsScreen = () => {
    const theme = useTheme();
    const { preference, setThemeKey, colors } = theme;
    const { signOut, isGuest } = useAuth();
    const navigation = useNavigation<any>();

    // Hooks into the device hardware safe zones (notches, islands, home bars)
    const insets = useSafeAreaInsets();

    // Pass insets to the styles function for dynamic padding calculation
    const styles = getStyles(theme, insets);

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
        // The stack header already clears the notch/status bar.
        paddingTop: spacing.lg,
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
    // The ring sits outside the circle so selection doesn't resize the swatch.
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