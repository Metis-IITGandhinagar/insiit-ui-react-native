import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { createMMKV } from "react-native-mmkv";
import { themes, ThemeMode, ThemePreference, SYSTEM_PREFERENCE, ColorScheme } from "./colors";
import radius from "./radius";
import shadows from "./shadows";
import spacing from "./spacing";
import typography from "./typography";
import sizes from "./sizes";

type ThemeContextType = {
    /** The palette actually in use. `system` is already resolved to light/dark here. */
    themeKey: ThemeMode;
    /** What the user picked — may be `system`. This is what the settings UI checks. */
    preference: ThemePreference;
    isDark: boolean;
    colors: ColorScheme;
    radius: typeof radius;
    shadows: typeof shadows;
    spacing: typeof spacing;
    typography: typeof typography;
    sizes: typeof sizes;
    setThemeKey: (preference: ThemePreference) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// MMKV rather than AsyncStorage because reads are synchronous: the stored theme is
// available for the very first render, so there's no flash of the wrong theme.
const storage = createMMKV({ id: "insiit.theme" });
const THEME_KEY = "themeKey";

const isPreference = (value: string): value is ThemePreference =>
    value === SYSTEM_PREFERENCE || value in themes;

const readStoredPreference = (): ThemePreference | null => {
    const stored = storage.getString(THEME_KEY);
    return stored && isPreference(stored) ? stored : null;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();

    // Anyone who has never chosen gets `system`; an existing stored palette is itself
    // a valid preference, so previous choices carry over untouched.
    const [preference, setPreferenceState] = useState<ThemePreference>(
        () => readStoredPreference() ?? SYSTEM_PREFERENCE
    );

    // Resolved on every render rather than stored, so an OS light/dark switch while
    // the app is open takes effect immediately — that's the whole point of `system`.
    // An explicit palette is returned as-is, so Emerald and Sunshine survive the
    // device flipping to dark.
    const themeKey: ThemeMode =
        preference === SYSTEM_PREFERENCE
            ? systemScheme === "dark"
                ? "dark"
                : "light"
            : preference;

    const setThemeKey = useCallback((next: ThemePreference) => {
        setPreferenceState(next);
        storage.set(THEME_KEY, next);
    }, []);

    const activeColors = themes[themeKey] || themes.light;
    const isDark = themeKey === "dark";

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
        preference,
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