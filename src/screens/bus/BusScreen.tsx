import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, ActivityIndicator, Text, View } from "react-native";
import FloatingNavbar from "../home/components/FloatingNavbar";
import BusHeader from "./components/BusHeader";
import BusTypeTabs from "./components/BusTypeTabs";
import NextBusHero from "./components/NextBusHero";
import TodaySchedule from "./components/TodaySchedule";
import RouteCard from "./components/RouteCard";
import { useBusData } from "./services/useBusData";
import { colors, spacing } from "@/theme";

const BusScreen = () => {
    const { selectedTab, setSelectedTab, departures, nextBus, stops, loading, error } = useBusData();

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <BusHeader />

                    <BusTypeTabs selected={selectedTab} onSelect={setSelectedTab} />

                    {loading ? (
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

                <FloatingNavbar />
            </SafeAreaView>
        </>
    );
};

export default BusScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 130,
        gap: spacing.lg,
    },

    centered: {
        paddingVertical: spacing.xxl,
        justifyContent: "center",
        alignItems: "center",
    },

    errorText: {
        color: colors.danger,
        fontWeight: "600",
        fontSize: 16,
    }
});