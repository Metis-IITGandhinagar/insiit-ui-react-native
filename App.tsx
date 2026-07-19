import React from "react";
import { ThemeProvider } from "@/core/theme"; 
import RootNavigator from "./src/core/navigation/RootNavigator"; 
import { AuthProvider } from './src/core/context/AuthProvider';

export default function App() {
    return (
        <AuthProvider>
        <ThemeProvider>
                <RootNavigator />
        </ThemeProvider>
        </AuthProvider>
    );
}