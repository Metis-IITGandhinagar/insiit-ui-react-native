import React, { useRef } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { RefreshCw } from "lucide-react-native";

import MessCard from "./components/MessCard";
import NextClassCard from "./components/NextClassCard";
import NextBusCard from "./components/NextBusCard";
import FloatingNavbar from "./components/FloatingNavbar";
import QRBottomSheet from "./components/QRBottomSheet";
import WeeklyMenuSheet from "./components/WeeklyMenuSheet";
import TimetableSheet from "./components/TimetableSheet";
import GreetingSection from "./components/GreetingSection";

import { colors, spacing, radius } from "@/theme";
import { useMessData } from "./services/useMessData";

import type { QRBottomSheetRef } from "./components/QRBottomSheet";
import type { WeeklyMenuSheetRef } from "./components/WeeklyMenuSheet";
import type { TimetableSheetRef } from "./components/TimetableSheet";

const HomeScreen = () => {
    const qrSheetRef = useRef<QRBottomSheetRef>(null);
    const menuSheetRef = useRef<WeeklyMenuSheetRef>(null);
    const timetableSheetRef = useRef<TimetableSheetRef>(null);

    const { menuData, currentMeal, loading, error, manualRefresh } = useMessData();

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <SafeAreaView style={styles.container}>
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
                        <GreetingSection />

                        <MessCard
                            meal={currentMeal}
                            onShowQR={() => qrSheetRef.current?.expand()}
                            onShowMenu={() => menuSheetRef.current?.expand()}
                        />

                        <NextClassCard onPress={() => timetableSheetRef.current?.expand()} />
                        <NextBusCard />
                    </ScrollView>
                )}

                <FloatingNavbar />

                <QRBottomSheet ref={qrSheetRef} />
                <WeeklyMenuSheet ref={menuSheetRef} data={menuData} />
                <TimetableSheet ref={timetableSheetRef} />
            </SafeAreaView>
        </>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
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