import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/home/HomeScreen";
import SearchScreen from "@/screens/search/SearchScreen";
import type { RootStackParamList } from "./types";
import BusScreen from "@/screens/bus/BusScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="Bus"
                component={BusScreen}/>
                {/* <Stack.Screen name="Bus"
                    component={BusScreen} />
                <Stack.Screen name="Bus"
                    component={BusScreen} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}