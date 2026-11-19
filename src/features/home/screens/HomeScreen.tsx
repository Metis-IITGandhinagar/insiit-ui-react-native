// src/screens/home/HomeScreen.tsx
import React, { useEffect, useRef } from "react";
import { ScrollView, StatusBar, StyleSheet, ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshCw } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import MessCard from "../components/MessCard";
import QRBottomSheet from "../components/QRBottomSheet";
import WeeklyMenuSheet from "../components/WeeklyMenuSheet";
import GreetingSection from "../components/GreetingSection";
import TimetableWidget from "../components/TimetableWidget";
import ServicesGrid from "../components/ServicesGrid";

import { useTheme } from "@core/theme";
import { useAuth } from "@/core/auth/useAuth";
import { registerPushDevice } from "@/features/notifications/services/pushRegistrationService";

import { useMessData } from "../hooks/useMessData";
import type { QRBottomSheetRef } from "../components/QRBottomSheet";
import type { WeeklyMenuSheetRef } from "../components/WeeklyMenuSheet";

const HomeScreen = () => {
    const qrSheetRef = useRef<QRBottomSheetRef>(null);
    const menuSheetRef = useRef<WeeklyMenuSheetRef>(null);
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const promptedForUser = useRef<string | null>(null);

    const { menuData, currentMeal, loading, error, manualRefresh } = useMessData();

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    // After @iitgn.ac.in login, when Home is first shown: ask notification permission
    // (if still needed) and register the device. First install, reinstall, returning users.
    useEffect(() => {
        const email = user?.email;
        if (!email) return;
        if (promptedForUser.current === email) return;
        promptedForUser.current = email;

        const timer = setTimeout(() => {
            void registerPushDevice().catch((err) =>
                console.warn('Home: push registration / permission prompt failed:', err)
            );
        }, 600);

        return () => clearTimeout(timer);
    }, [user?.email]);

    return (
        <>
            <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                {loading && !menuData ? (
                    <View style={styles.centeredView}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error && !menuData ? (
                    <View style={styles.centeredView}>
                        <Text style={styles.errTitle}>Connectivity Error</Text>
                        <Text style={styles.errSubtitle}>Could not resolve menu sync tracking files over IITGN infrastructure lanes.</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={manualRefresh}>
                            <RefreshCw size={16} color="white" />
                            <Text style={styles.retryText}>Retry Connection</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
                        <GreetingSection onRefresh={manualRefresh} refreshing={loading} />

                        <MessCard
                            meal={currentMeal}
                            onShowQR={() => qrSheetRef.current?.expand()}
                            onShowMenu={() => menuSheetRef.current?.expand()}
                        />

                        <TimetableWidget />

                        <ServicesGrid />

                    </ScrollView>
                )}
                <QRBottomSheet ref={qrSheetRef} />
                <WeeklyMenuSheet ref={menuSheetRef} data={menuData} />
            </SafeAreaView>
        </>
    );
};

export default HomeScreen;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentScroll: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.lg,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.background,
    },
    errTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 6,
    },
    errSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: spacing.lg,
        lineHeight: 20,
    },
    retryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        borderRadius: radius.md,
        gap: 8,
    },
    retryText: {
        color: "white",
        fontWeight: "600",
    }
});