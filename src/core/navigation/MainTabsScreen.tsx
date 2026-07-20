// src/navigation/MainTabsScreen.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { SwipeProvider } from "./SwipeContext";
import MainPager from "./MainPager";
import FloatingNavbar from "@/features/home/components/FloatingNavbar";
import { useTheme } from "@/core/theme";

const MainTabsScreen = () => {
    const { colors } = useTheme();

    return (
        <SwipeProvider>
            <View style={[styles.flex, { backgroundColor: colors.background }]}>
                <MainPager />
                <FloatingNavbar />
            </View>
        </SwipeProvider>
    );
};

export default MainTabsScreen;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});