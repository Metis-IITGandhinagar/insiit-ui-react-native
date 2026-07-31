// src/screens/home/HomeScreen.tsx
import React, { useRef } from "react";
import { StyleSheet, ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { RefreshCw } from "lucide-react-native";

import Screen from "@/components/Screen";
import MessCard from "./components/MessCard";
import QRBottomSheet from "./components/QRBottomSheet";
import WeeklyMenuSheet from "./components/WeeklyMenuSheet";
import GreetingSection from "./components/GreetingSection";
import TimetableWidget from "./components/TimetableWidget";

import { useTheme } from "@/theme";
import { useMessData } from "./services/mess/useMessData";

import type { QRBottomSheetRef } from "./components/QRBottomSheet";
import type { WeeklyMenuSheetRef } from "./components/WeeklyMenuSheet";

const HomeScreen = () => {
    const qrSheetRef = useRef<QRBottomSheetRef>(null);
    const menuSheetRef = useRef<WeeklyMenuSheetRef>(null);

    const { menuData, currentMeal, loading, error, manualRefresh } = useMessData();

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const sheets = (
        <>
            <QRBottomSheet ref={qrSheetRef} />
            <WeeklyMenuSheet ref={menuSheetRef} data={menuData} />
        </>
    );

    if (loading && !menuData) {
        return (
            <Screen scroll={false} overlay={sheets}>
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </Screen>
        );
    }

    if (error && !menuData) {
        return (
            <Screen scroll={false} overlay={sheets}>
                <View style={styles.centeredView}>
                    <Text style={styles.errTitle}>Connectivity Error</Text>
                    <Text style={styles.errSubtitle}>Could not resolve menu sync tracking files over IITGN infrastructure lanes.</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={manualRefresh}>
                        <RefreshCw size={16} color="white" />
                        <Text style={styles.retryText}>Retry Connection</Text>
                    </TouchableOpacity>
                </View>
            </Screen>
        );
    }

    return (
        <Screen overlay={sheets}>
            <GreetingSection />

            <MessCard
                meal={currentMeal}
                onShowQR={() => qrSheetRef.current?.expand()}
                onShowMenu={() => menuSheetRef.current?.expand()}
            />
            <TimetableWidget />
        </Screen>
    );
};

export default HomeScreen;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
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