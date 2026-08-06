import React from "react";
import { ThemeProvider } from "@/core/theme"; 
import RootNavigator from "./src/core/navigation/RootNavigator"; 
import { AuthProvider } from './src/core/context/AuthProvider';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
    return (
        <SafeAreaProvider>
        <AuthProvider>
        <ThemeProvider>
                <RootNavigator />
        </ThemeProvider>
        </AuthProvider>
        </SafeAreaProvider>
    );
}