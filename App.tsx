import React from "react";
import { ThemeProvider } from "@/theme"; 
import RootNavigator from "./src/navigation/RootNavigator"; 
import { AuthProvider } from './src/context/AuthProvider';

export default function App() {
    return (
        <AuthProvider>
        <ThemeProvider>
                <RootNavigator />
        </ThemeProvider>
        </AuthProvider>
    );
}