import React from "react";
import { ThemeProvider } from "@/theme"; // 1. Import the provider
import RootNavigator from "./src/navigation/RootNavigator"; // App.tsx

export default function App() {
    return (
        <ThemeProvider>
                <RootNavigator />
        </ThemeProvider>
    );
}