import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/home/HomeScreen";
import SearchScreen from "@/screens/search/SearchScreen";
import BusScreen from "@/screens/bus/BusScreen";
import ToolsScreen from "@/screens/tools/ToolsScreen";
import MoreScreen from "@/screens/more/MoreScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="Bus" component={BusScreen} />
                <Stack.Screen name="Tools" component={ToolsScreen} />
                <Stack.Screen name="More" component={MoreScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}