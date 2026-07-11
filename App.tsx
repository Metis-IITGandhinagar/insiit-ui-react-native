import React from "react";
import { ThemeProvider } from "@/theme"; // 1. Import the provider
import RootNavigator from "./src/navigation/RootNavigator"; // Your existing setup

export default function App() {
    return (
        // 2. Wrap EVERYTHING inside the ThemeProvider
        <ThemeProvider>
            <RootNavigator />
        </ThemeProvider>
    );
}