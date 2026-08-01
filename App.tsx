import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/theme";
import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from './src/context/AuthProvider';

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
