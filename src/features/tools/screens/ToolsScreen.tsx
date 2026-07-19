// src/screens/tools/ToolsScreen.tsx
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import ToolsHeader from "../components/ToolsHeader";
import ToolSection from "../components/ToolSection";
import { useTheme } from "@/core/theme";
import QuickActions from "../components/QuickActions";
import { EmergencyCard } from "../components/EmergencyCard";

const ToolsScreen = () => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <>
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
            </SafeAreaView>
        </>
    );
};

export default ToolsScreen;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
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