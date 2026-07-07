import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import FloatingNavbar from "../home/components/FloatingNavbar";

import ToolsHeader from "./components/ToolsHeader";
import EmergencyCard from "./components/EmergencyCard";
import ToolSection from "./components/ToolSection";
import { colors, spacing } from "@/theme";
import QuickActions from "./components/QuickActions";

const ToolsScreen = () => {
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
                    <ToolsHeader />

                    <EmergencyCard />

                    <QuickActions />

                    <ToolSection />
                </ScrollView>

                <FloatingNavbar />
            </SafeAreaView>
        </>
    );
};

export default ToolsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.lg,
    },
});