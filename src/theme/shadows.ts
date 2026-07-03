import { Platform } from "react-native";

export const shadows = {
    sm: Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
        },
        android: {
            elevation: 2,
        },
        default: {},
    }),

    md: Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        },
        android: {
            elevation: 4,
        },
        default: {},
    }),

    lg: Platform.select({
        ios: {
            shadowColor: "#000",
            shadowOpacity: 0.16,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
        },
        android: {
            elevation: 8,
        },
        default: {},
    }),
} as const;