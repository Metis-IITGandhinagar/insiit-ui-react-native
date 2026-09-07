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
import AboutScreen from "@/features/about/screens/AboutScreen";
import PrivacyPolicyScreen from "@/features/about/screens/PrivacyPolicyScreen";
import TeamScreen from "@/features/about/screens/TeamScreen";
import RepresentativesScreen from "@/features/about/screens/RepresentativesScreen";
import LostFoundScreen from "@/features/lostfound/screens/LostFoundScreen";
import CabshareScreen from "@/features/cabshare/screens/CabshareScreen";
import BuySellScreen from "@/features/buysell/screens/BuySellScreen";
import { useTheme } from "@/core/theme";
import { AdminDashboardScreen } from "@/features/admin/screens/AdminDashboardScreen";
import { AnnouncementManagementScreen } from "@/features/admin/screens/AnnouncementManagementScreen";
import { MessMenuManagementScreen } from "@/features/admin/screens/MessMenuManagementScreen";
import { UserManagementScreen } from "@/features/admin/screens/UserManagementScreen";
// Add the new import
import AdminEventsApprovalScreen from "@/features/admin/screens/AdminEventsApprovalScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, isGuest, loading } = useAuth();
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
            <NavigationContainer theme={navigationTheme}>
                <Stack.Navigator
                    screenOptions={{
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
                        animation: "simple_push",
                        animationDuration: 200,
                    }}
                >
                    {user || isGuest ? (
                        <>
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
                                {/* Add the new admin screen here */}
                                <Stack.Screen
                                    name="AdminEventsApproval"
                                    component={AdminEventsApprovalScreen}
                                    options={{ title: "Event Approvals" }}
                                />
                            </Stack.Group>

                            {isGuest && (
                                <Stack.Screen
                                    name="Login"
                                    component={LoginScreen}
                                    options={{ headerShown: false, animation: "slide_from_bottom" }}
                                />
                            )}
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
                        name="Representatives"
                        component={RepresentativesScreen}
                        options={{ title: "Representatives" }}
                    />
                    <Stack.Screen
                        name="AboutInsiit"
                        component={AboutScreen}
                        options={{ title: "About INSIIT" }}
                    />
                    <Stack.Screen
                        name="TeamINSIIT"
                        component={TeamScreen}
                        options={{ title: "Team INSIIT" }}
                    />
                    <Stack.Screen
                        name="PrivacyPolicy"
                        component={PrivacyPolicyScreen}
                        options={{ title: "Privacy Policy" }}
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