import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import { colors, spacing } from "@/theme";

import AdminHeader from "../components/AdminHeader";

import EventToolbar from "./components/EventToolbar";

const EventDashboardScreen = () => {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <AdminHeader />

                    <EventToolbar />

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default EventDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
    },
});