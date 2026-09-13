export type ThemeMode = 'light' | 'dark' | 'emerald' | 'sunshine';

/**
 * What the user picked. `system` isn't a palette — it resolves to `light` or `dark`
 * from the OS setting, and keeps following it when the OS switches.
 */
export type ThemePreference = ThemeMode | 'system';

export const SYSTEM_PREFERENCE = 'system' as const;

export interface ColorScheme {
    primary: string;
    primaryLight: string;
    /**
     * Foreground for content sitting *on* `primary` (hero cards, filled badges).
     * Distinct from `surface`, which some screens used for this by accident: it happens
     * to be white in the light themes, but is dark slate in the dark one — which put
     * near-black text on a blue card.
     */
    onPrimary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    danger: string;
    success: string;
    warning: string;
}

export interface ThemeOption {
    id: ThemePreference;
    label: string;
    description: string;
    primaryColor: string;
    previewBg: string;
    isDark: boolean;
    /** Swatch gradient: the theme's surface colour running into its accent. */
    swatch: [string, string];
}

export const themeOptions: ThemeOption[] = [
    {
        id: SYSTEM_PREFERENCE,
        label: 'System',
        description: 'Follows your device light/dark setting',
        primaryColor: '#2563EB',
        previewBg: '#F8FAFC',
        isDark: false,
        // Light into dark, because that's exactly the choice it defers to the OS.
        swatch: ['#F8FAFC', '#0F172A'],
    },
    {
        id: 'light',
        label: 'Light Classic',
        description: 'Clean slate with soft blue accents',
        primaryColor: '#2563EB',
        previewBg: '#F8FAFC',
        isDark: false,
        swatch: ['#F8FAFC', '#2563EB'],
    },
    {
        id: 'dark',
        label: 'Dark Slate',
        description: 'Subtle slate gray dark mode',
        primaryColor: '#3B82F6',
        previewBg: '#0F172A',
        isDark: true,
        swatch: ['#334155', '#3B82F6'],
    },
    {
        id: 'emerald',
        label: 'Emerald Campus',
        description: 'Refreshing campus green aesthetic',
        primaryColor: '#059669',
        previewBg: '#F0FDF4',
        isDark: false,
        swatch: ['#F0FDF4', '#059669'],
    },
    {
        id: 'sunshine',
        label: 'Sunshine Rise',
        description: 'Beauty of beginnings last forever',
        primaryColor: '#EA580C',
        previewBg: '#FAFAF9',
        swatch: ['#FAFAF9', '#EA580C'],
        isDark: false,
    },
];

export const themes: Record<ThemeMode, ColorScheme> = {
    light: {
        primary: '#2563EB',
        primaryLight: '#EFF6FF',
        onPrimary: '#FFFFFF',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },
    dark: {
        primary: '#3B82F6',
        primaryLight: '#1E293B',
        onPrimary: '#FFFFFF',
        background: '#0F172A',
        surface: '#1E293B',
        card: '#1E293B',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: '#334155',
        danger: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
    },
    emerald: {
        primary: '#059669',
        primaryLight: '#ECFDF5',
        onPrimary: '#FFFFFF',
        background: '#F0FDF4',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#064E3B',
        textSecondary: '#047857',
        border: '#A7F3D0',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },
    sunshine: {
        primary: '#EA580C',
        primaryLight: '#FFF7ED',
        onPrimary: '#FFFFFF',
        background: '#FAFAF9',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: '#292524',
        textSecondary: '#78716C',
        border: '#E7E5E4',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },
};

export const lightColors = themes.light;
export const darkColors = themes.dark;