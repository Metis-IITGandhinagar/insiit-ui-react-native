import React, { createContext, PropsWithChildren } from "react";
import { theme, AppTheme } from "./theme";

export const ThemeContext = createContext<AppTheme>(theme);

export function ThemeProvider({ children }: PropsWithChildren) {
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}