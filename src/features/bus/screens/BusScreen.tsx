// src/screens/bus/BusScreen.tsx
import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, ActivityIndicator, Text, View, RefreshControl } from "react-native";

import BusHeader from "../components/BusHeader";
import BusTypeTabs from "../components/BusTypeTabs";
import NextBusHero from "../components/NextBusHero";
import TodaySchedule from "../components/TodaySchedule";
import RouteCard from "../components/RouteCard";

import { useBusData } from "../hooks/useBusData";
import { useTheme } from "@/core/theme";

const BusScreen = () => {
    const { selectedTab, setSelectedTab, departures, nextBus, stops, loading, error, refreshBuses } = useBusData();

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <>
            <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading && departures.length > 0}
                            onRefresh={refreshBuses}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <BusHeader />

                    <BusTypeTabs selected={selectedTab} onSelect={setSelectedTab} />

                    {loading && departures.length === 0 ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <>
                            <NextBusHero data={nextBus} />
                            <TodaySchedule departures={departures} />
                            <RouteCard stops={stops} />
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default BusScreen;

const getStyles = ({ colors, spacing }: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 130, gap: spacing.lg },
    centered: { paddingVertical: spacing.xxl, justifyContent: "center", alignItems: "center" },
    errorText: { color: colors.danger || 'red', fontWeight: "600", fontSize: 16 }
});