// src/screens/bus/BusScreen.tsx
import React, { useState } from "react";
import { StyleSheet, ActivityIndicator, Text, View, TouchableOpacity, RefreshControl } from "react-native";

import Screen from "@/components/Screen";
import BusHeader from "./components/BusHeader";
import BusTypeTabs from "./components/BusTypeTabs";
import NextBusHero from "./components/NextBusHero";
import TodaySchedule from "./components/TodaySchedule";
import RouteCard from "./components/RouteCard";
import AddBusModal from "./components/AddBusModal";

import { useBusData } from "./services/useBusData";
import { useTheme } from "@/theme";
import { useAuth } from "../../hooks/useAuth";

const BusScreen = () => {
    const { selectedTab, setSelectedTab, departures, nextBus, stops, loading, error, refreshBuses } = useBusData();
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const { hasPermission } = useAuth();
    const theme = useTheme();
    const { colors, spacing } = theme;
    const styles = getStyles(theme);

    const addModal = (
        <AddBusModal
            visible={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSuccess={() => {
                setAddModalOpen(false);
                refreshBuses();
            }}
        />
    );

    return (
        <Screen
            overlay={addModal}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refreshBuses} tintColor={colors.primary} />
            }
        >
            <BusHeader />

            <View style={styles.tabRow}>
                <View style={{ flex: 1 }}>
                    <BusTypeTabs selected={selectedTab} onSelect={setSelectedTab} />
                </View>

                {hasPermission('post_bus_schedule') && (
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                        onPress={() => setAddModalOpen(true)}
                    >
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                )}
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
        </Screen>
    );
};

export default BusScreen;

const getStyles = ({ colors, spacing }: any) => StyleSheet.create({
    tabRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
    addButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, justifyContent: 'center' },
    addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    centered: { paddingVertical: spacing.xxl, justifyContent: "center", alignItems: "center" },
    errorText: { color: colors.danger || 'red', fontWeight: "600", fontSize: 16 }
});