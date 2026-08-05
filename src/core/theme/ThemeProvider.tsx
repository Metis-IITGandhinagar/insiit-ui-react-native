import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { themes, ThemeMode, ColorScheme } from "./colors";
import radius from "./radius";
import shadows from "./shadows";
import spacing from "./spacing";
import typography from "./typography";
import sizes from "./sizes";

type ThemeContextType = {
    themeKey: ThemeMode;
    isDark: boolean;
    colors: ColorScheme;
    radius: typeof radius;
    shadows: typeof shadows;
    spacing: typeof spacing;
    typography: typeof typography;
    sizes: typeof sizes;
    setThemeKey: (key: ThemeMode) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [themeKey, setThemeKey] = useState<ThemeMode>(systemScheme === "dark" ? "dark" : "light");

    useEffect(() => {
        if (systemScheme) {
            setThemeKey(systemScheme === "dark" ? "dark" : "light");
        }
    }, [systemScheme]);

    const activeColors = themes[themeKey] || themes.light;
    const isDark = themes[themeKey] ? (themeKey === "dark") : false;

    // The native root view lives outside the React tree, so it keeps its own
    // background. Without this it shows through during screen transitions.
    useEffect(() => {
        SystemUI.setBackgroundColorAsync(activeColors.background);
    }, [activeColors.background]);

    const toggleTheme = () => {
        setThemeKey((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const value = {
        themeKey,
        isDark,
        colors: activeColors,
        radius,
        shadows,
        spacing,
        typography,
        sizes,
        setThemeKey,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};