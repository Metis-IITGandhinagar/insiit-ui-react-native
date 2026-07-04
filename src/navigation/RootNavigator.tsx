import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootStack } from "./RootStack";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";

export function RootNavigator() {
    const isAuthenticated = true;

    return (
        <NavigationContainer>
            {isAuthenticated ? <RootStack /> : <AuthStack />}
        </NavigationContainer>
    );
}