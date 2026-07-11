// theme/colors.ts

const brandColors = {
    primary: "#2563EB",
    secondary: "#3B82F6",
    accent: "#1695D2",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
};

export const lightColors = {
    ...brandColors,
    background: "#F5F8FC",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFC",
    text: "#111827",
    textStrong: "#111111",
    textSecondary: "#64748B",
    textMuted: "#555555",
    border: "#E5E7EB",
    borderSoft: "#E2E8F0",
    inactive: "#94A3B8",
};

export const darkColors = {
    ...brandColors,
    background: "#0F172A",       // Slate 900
    surface: "#1E293B",          // Slate 800
    surfaceAlt: "#334155",       // Slate 700
    text: "#F9FAFB",
    textStrong: "#FFFFFF",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    border: "#334155",
    borderSoft: "#1E293B",
    inactive: "#475569",
};