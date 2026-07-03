import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./types";
import { HomeScreen } from "@/features/home/HomeScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

function PlaceholderScreen({ title }: { title: string }) {
    return (
        <View style={styles.container}>
            <Text>{title}</Text>
        </View>
    );
}

export function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />

            <Tab.Screen name="Outlets">
                {() => <PlaceholderScreen title="Outlets" />}
            </Tab.Screen>

            <Tab.Screen name="Buses">
                {() => <PlaceholderScreen title="Buses" />}
            </Tab.Screen>

            <Tab.Screen name="Services">
                {() => <PlaceholderScreen title="Services" />}
            </Tab.Screen>

            <Tab.Screen name="More">
                {() => <PlaceholderScreen title="More" />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});