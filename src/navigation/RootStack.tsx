import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./types";

import { MainTabs } from "./MainTabs";

import { MessScreen } from "../features/mess/MessScreen";

const Stack =
    createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="MainTabs"
                component={MainTabs}
            />

            <Stack.Screen
                name="Mess"
                component={MessScreen}
            />
        </Stack.Navigator>
    );
}