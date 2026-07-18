// src/navigation/MainTabsScreen.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { SwipeProvider } from "./SwipeContext";
import MainPager from "./MainPager";
import FloatingNavbar from "@/screens/home/components/FloatingNavbar";

const MainTabsScreen = () => {
    return (
        <SwipeProvider>
            <View style={styles.flex}>
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