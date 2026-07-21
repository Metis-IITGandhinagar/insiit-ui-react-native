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
import ProfileScreen from "@/features/more/screens/ProfieScreen";
import SettingsScreen from "@/features/more/screens/SettingsScreen";
import { useTheme } from "@/core/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, loading } = useAuth();
    const { colors, isDark } = useTheme();

    const navigationTheme = {
        ...DefaultTheme,
        dark: isDark,
        colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
        },
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#A52A2A" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: "none",
                    }}
                >
                    {user ? (
                        <>
                            <Stack.Screen name="MainTabs" component={MainTabsScreen} />
                            <Stack.Screen
                                name="Profile"
                                component={ProfileScreen}
                            /> 
                            <Stack.Screen
                                name="Settings"
                                component={SettingsScreen}
                            /> 

                            {/* <Stack.Screen
                                name="AdminDashboard"
                                component={AdminDashboard}
                            /> */}
                            {/* <Stack.Screen
                                name="Representatives"
                                component={RepresentativesScreen}
                                options={{ animation: "slide_from_right" }}
                            />
                            <Stack.Screen
                                name="TeamINSIIT"
                                component={TeamScreen}
                                options={{ animation: "slide_from_right" }}
                            />
                            <Stack.Screen
                                name="VersionNerd"
                                component={VersionNerdScreen}
                                options={{ animation: "fade" }}
                            /> */}
                        </>
                    ) : (
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />
                    )}
                    <Stack.Screen
                        name="CourseSearch"
                        component={CourseSearchScreen}
                        options={{
                            headerShown: false,
                            animation: 'slide_from_right'
                        }}
                    />
                    <Stack.Screen
                        name="MessFeedback"
                        component={MessFeedbackScreen}
                        options={{
                            headerShown: false,
                            animation: 'slide_from_right'
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}