export type ThemeMode = 'light' | 'dark' | 'emerald' | 'sunshine';

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
    id: ThemeMode;
    label: string;
    description: string;
    primaryColor: string;
    previewBg: string;
    isDark: boolean;
}

export const themeOptions: ThemeOption[] = [
    {
        id: 'light',
        label: 'Light Classic',
        description: 'Clean slate with soft blue accents',
        primaryColor: '#2563EB',
        previewBg: '#F8FAFC',
        isDark: false,
    },
    {
        id: 'dark',
        label: 'Dark Slate',
        description: 'Subtle slate gray dark mode',
        primaryColor: '#3B82F6',
        previewBg: '#0F172A',
        isDark: true,
    },
    {
        id: 'emerald',
        label: 'Emerald Campus',
        description: 'Refreshing campus green aesthetic',
        primaryColor: '#059669',
        previewBg: '#F0FDF4',
        isDark: false,
    },
    {
        id: 'sunshine',
        label: 'Sunshine Rise',
        description: 'Beauty of beginnings last forever',
        primaryColor: '#EA580C',
        previewBg: '#FAFAF9',
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