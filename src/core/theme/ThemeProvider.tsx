import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { createMMKV } from "react-native-mmkv";
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

// MMKV rather than AsyncStorage because reads are synchronous: the stored theme is
// available for the very first render, so there's no flash of the wrong theme.
const storage = createMMKV({ id: "insiit.theme" });
const THEME_KEY = "themeKey";

const readStoredTheme = (): ThemeMode | null => {
    const stored = storage.getString(THEME_KEY);
    return stored && stored in themes ? (stored as ThemeMode) : null;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [themeKey, setThemeKeyState] = useState<ThemeMode>(
        () => readStoredTheme() ?? (systemScheme === "dark" ? "dark" : "light")
    );

    // The system scheme is only a default for someone who has never chosen a theme.
    // Once they have, an OS light/dark switch must not clobber it — that used to wipe
    // out Emerald and Sunshine entirely.
    useEffect(() => {
        if (!systemScheme || readStoredTheme()) return;
        setThemeKeyState(systemScheme === "dark" ? "dark" : "light");
    }, [systemScheme]);

    const setThemeKey = useCallback((key: ThemeMode) => {
        setThemeKeyState(key);
        storage.set(THEME_KEY, key);
    }, []);

    const activeColors = themes[themeKey] || themes.light;
    const isDark = themes[themeKey] ? (themeKey === "dark") : false;

    // The native root view lives outside the React tree, so it keeps its own
    // background. Without this it shows through during screen transitions.
    useEffect(() => {
        SystemUI.setBackgroundColorAsync(activeColors.background);
    }, [activeColors.background]);

    const toggleTheme = useCallback(() => {
        setThemeKey(themeKey === "dark" ? "light" : "dark");
    }, [themeKey, setThemeKey]);

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