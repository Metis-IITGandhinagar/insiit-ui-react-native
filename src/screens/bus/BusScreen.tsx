import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import FloatingNavbar from "../home/components/FloatingNavbar";

import BusHeader from "./components/BusHeader";
import BusTypeTabs from "./components/BusTypeTabs";
import NextBusHero from "./components/NextBusHero";
import TodaySchedule from "./components/TodaySchedule";
import RouteCard from "./components/RouteCard";

const BusScreen = () => {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F8FC"
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <BusHeader />

                    <BusTypeTabs />

                    <NextBusHero />

                    <TodaySchedule />

                    <RouteCard />
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
        backgroundColor: "#F5F8FC",
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 120,
        gap: 20,
    },
});