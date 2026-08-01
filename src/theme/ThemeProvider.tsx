// theme/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "./colors";
import radius from "./radius";
import shadows from "./shadows";
import spacing from "./spacing";
import typography from "./typography";
import sizes from "./sizes";
import layout from "./layout";

type ThemeContextType = {
    isDark: boolean;
    colors: typeof lightColors;
    radius: typeof radius;
    shadows: typeof shadows;
    spacing: typeof spacing;
    typography: typeof typography;
    sizes: typeof sizes;
    layout: typeof layout;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === "dark");

    useEffect(() => {
        setIsDark(systemScheme === "dark");
    }, [systemScheme]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    const value = {
        isDark,
        colors: isDark ? darkColors : lightColors,
        radius,
        shadows,
        spacing,
        typography,
        sizes,
        layout,
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