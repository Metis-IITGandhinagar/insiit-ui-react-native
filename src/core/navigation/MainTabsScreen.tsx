// src/navigation/MainTabsScreen.tsx
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { SwipeProvider, useTabNavigation } from "./SwipeContext";
import MainPager from "./MainPager";
import FloatingNavbar from "@/features/home/components/FloatingNavbar";
import type { RootStackParamList } from "./types";
import { useTheme } from "@/core/theme";

/**
 * Applies a `MainTabs` route param like `{ tab: "Bus" }` to the pager.
 *
 * The tabs aren't stack routes — they're panes inside MainPager, reachable only
 * through the swipe context — so anything outside MainTabs (global search, a deep
 * link) asks for a tab by navigating here with a param instead of pushing a route.
 * Must live inside SwipeProvider to reach that context.
 */
const RequestedTabBridge = () => {
    const route = useRoute<RouteProp<RootStackParamList, "MainTabs">>();
    const navigation = useNavigation<any>();
    const { goToTab } = useTabNavigation();

    const requested = route.params?.tab;

    useEffect(() => {
        if (!requested) return;

        goToTab(requested);
        // Cleared so asking for the same tab twice runs this again — React Navigation
        // keeps identical params in place, which would make the second request a no-op.
        navigation.setParams({ tab: undefined });
    }, [goToTab, navigation, requested]);

    return null;
};

const MainTabsScreen = () => {
    const { colors } = useTheme();

    return (
        <SwipeProvider>
            <RequestedTabBridge />
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
