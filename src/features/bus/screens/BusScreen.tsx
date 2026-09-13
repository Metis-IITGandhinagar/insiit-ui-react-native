// src/screens/bus/BusScreen.tsx
import React from "react";
import { ScrollView, StatusBar, StyleSheet, ActivityIndicator, Text, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BusHeader from "../components/BusHeader";
import BusRouteTabs from "../components/BusRouteTabs";
import NextBusHero from "../components/NextBusHero";
import TodaySchedule from "../components/TodaySchedule";
import RouteCard from "../components/RouteCard";

import OfflineNotice from "@/shared/components/OfflineNotice";
import { useBusData } from "../hooks/useBusData";
import { useTheme } from "@/core/theme";

const BusScreen = () => {
    const {
        routes,
        selectedRoute,
        setSelectedRoute,
        departures,
        nextBus,
        stops,
        loading,
        refreshing,
        error,
        usingCachedData,
        lastUpdatedAt,
        refreshBuses,
    } = useBusData();

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <>
            <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshBuses}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <BusHeader />

                    <BusRouteTabs routes={routes} selected={selectedRoute} onSelect={setSelectedRoute} />

                    <OfflineNotice visible={usingCachedData} lastUpdatedAt={lastUpdatedAt} />

                    {loading && departures.length === 0 ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : departures.length === 0 ? (
                        // Say so rather than rendering three empty cards, which is how the
                        // old hardcoded tabs failed: silently blank, indistinguishable from
                        // a layout bug.
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>No departures scheduled</Text>
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
    content: { paddingHorizontal: spacing.lg, paddingBottom: 130, gap: spacing.lg },
    centered: { paddingVertical: spacing.xxl, justifyContent: "center", alignItems: "center" },
    errorText: { color: colors.danger || 'red', fontWeight: "600", fontSize: 16 },
    emptyText: { color: colors.textSecondary, fontWeight: "600", fontSize: 16 }
});