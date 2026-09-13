// src/screens/tools/ToolsScreen.tsx
import React from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
        paddingBottom: 120,
        gap: spacing.lg,
    },
});