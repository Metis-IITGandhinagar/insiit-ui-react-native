// src/screens/bus/BusScreen.tsx
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, ActivityIndicator, Text, View, TouchableOpacity, RefreshControl } from "react-native";

import BusHeader from "../components/BusHeader";
import BusTypeTabs from "../components/BusTypeTabs";
import NextBusHero from "../components/NextBusHero";
import TodaySchedule from "../components/TodaySchedule";
import RouteCard from "../components/RouteCard";

import { useBusData } from "../hooks/useBusData";
import { useTheme } from "@/core/theme";
import { useAuth } from "@/core/auth/useAuth";

const BusScreen = () => {
    const { selectedTab, setSelectedTab, departures, nextBus, stops, loading, error, refreshBuses } = useBusData();
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const { hasPermission } = useAuth();
    const theme = useTheme();
    const { colors, spacing } = theme;
    const styles = getStyles(theme);

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={refreshBuses} tintColor={colors.primary} />
                    }
                >
                    <BusHeader />

                    <View style={styles.tabRow}>
                        <View style={{ flex: 1 }}>
                            <BusTypeTabs selected={selectedTab} onSelect={setSelectedTab} />
                        </View>
                    </View>

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
    tabRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
    addButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, justifyContent: 'center' },
    addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    centered: { paddingVertical: spacing.xxl, justifyContent: "center", alignItems: "center" },
    errorText: { color: colors.danger || 'red', fontWeight: "600", fontSize: 16 }
});