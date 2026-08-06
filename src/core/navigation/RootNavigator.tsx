// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import type { RootStackParamList } from "./types";
import { useAuth } from '@/core/auth/useAuth';

import LoginScreen from "@/core/auth/screens/LoginScreen";
import MainTabsScreen from "./MainTabsScreen";
import CourseSearchScreen from '@/features/home/screens/CourseSearchScreen';
import MessFeedbackScreen from "@/features/tools/screens/MessFeedbackScreen";
import ProfileScreen from "@/features/more/screens/ProfileScreen";
import SettingsScreen from "@/features/more/screens/SettingsScreen";
import CampusMapScreen from "@/features/map/screens/CampusMapScreen";
import OutletsScreen from "@/features/outlets/screens/OutletsScreen";
import AnnouncementsScreen from "@/features/announcements/screens/AnnouncementsScreen";
import LostFoundScreen from "@/features/lostfound/screens/LostFoundScreen";
import CabshareScreen from "@/features/cabshare/screens/CabshareScreen";
import BuySellScreen from "@/features/buysell/screens/BuySellScreen";
import { useTheme } from "@/core/theme";
import { AdminDashboardScreen } from "@/features/admin/screens/AdminDashboardScreen";
import { AnnouncementManagementScreen } from "@/features/admin/screens/AnnouncementManagementScreen";
import { MessMenuManagementScreen } from "@/features/admin/screens/MessMenuManagementScreen";
import { UserManagementScreen } from "@/features/admin/screens/UserManagementScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, loading } = useAuth();
    const { colors, isDark, typography } = useTheme();

    const navigationTheme = {
        ...DefaultTheme,
        dark: isDark,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
        },
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.background,
                }}
            >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Without this the container falls back to react-navigation's DefaultTheme,
                whose background is a light grey that flashes during transitions. */}
            <NavigationContainer theme={navigationTheme}>
                <Stack.Navigator
                    screenOptions={{
                        // Pushed screens use the built-in header, so every one of them
                        // gets a back button without each screen rolling its own.
                        headerShown: true,
                        headerTitleAlign: "left",
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.text,
                        headerTitleStyle: {
                            fontSize: typography.h3.fontSize,
                            fontWeight: typography.h3.fontWeight,
                            color: colors.text,
                        },
                        contentStyle: { backgroundColor: colors.background },
                        // One transition for the whole stack, tuned to feel as quick as
                        // the tab pager. animationDuration only affects iOS; Android uses
                        // its own (already brisk) push timing.
                        animation: "simple_push",
                        animationDuration: 200,
                    }}
                >
                    {user ? (
                        <>
                            {/* The tab host draws its own floating navbar and pages. */}
                            <Stack.Screen
                                name="MainTabs"
                                component={MainTabsScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Profile"
                                component={ProfileScreen}
                                options={{ title: "Profile" }}
                            />
                            <Stack.Screen
                                name="Settings"
                                component={SettingsScreen}
                                options={{ title: "Settings" }}
                            />
                            {/* Grouped rather than nested: a child stack would only be
                                organising code, and would cost a hidden parent header
                                plus a hand-rolled back button on its first screen. */}
                            <Stack.Group>
                                <Stack.Screen
                                    name="AdminDashboard"
                                    component={AdminDashboardScreen}
                                    options={{ title: "Admin Console" }}
                                />
                                <Stack.Screen
                                    name="AnnouncementManagement"
                                    component={AnnouncementManagementScreen}
                                    options={{ title: "Announcements" }}
                                />
                                <Stack.Screen
                                    name="MessMenuManagement"
                                    component={MessMenuManagementScreen}
                                    options={{ title: "Mess Schedule" }}
                                />
                                <Stack.Screen
                                    name="UserManagement"
                                    component={UserManagementScreen}
                                    options={{ title: "User Permissions" }}
                                />
                            </Stack.Group>
                        </>
                    ) : (
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                    )}
                    <Stack.Screen
                        name="CourseSearch"
                        component={CourseSearchScreen}
                        options={{ title: "Course Search" }}
                    />
                    <Stack.Screen
                        name="MessFeedback"
                        component={MessFeedbackScreen}
                        options={{ title: "Mess Feedback" }}
                    />
                    <Stack.Screen
                        name="CampusMap"
                        component={CampusMapScreen}
                        options={{ title: "Campus Map" }}
                    />
                    <Stack.Screen
                        name="Outlets"
                        component={OutletsScreen}
                        options={{ title: "Outlets" }}
                    />
                    <Stack.Screen
                        name="Announcements"
                        component={AnnouncementsScreen}
                        options={{ title: "Announcements" }}
                    />
                    <Stack.Screen
                        name="LostFound"
                        component={LostFoundScreen}
                        options={{ title: "Lost & Found" }}
                    />
                    <Stack.Screen
                        name="Cabshare"
                        component={CabshareScreen}
                        options={{ title: "Cabshare" }}
                    />
                    <Stack.Screen
                        name="BuySell"
                        component={BuySellScreen}
                        options={{ title: "Buy & Sell" }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}