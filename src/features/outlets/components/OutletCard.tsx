import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/shared/components/Card";
import { useTheme } from "@/core/theme";
import { resolveBackendAsset } from "@/core/api/apiClient";
import { Outlet } from "../services/outletTypes";

interface Props {
    outlet: Outlet;
    onPress?: () => void;
}

const formatTime = (time: string) => {
    if (!time) return "";
    const parsed = new Date(time);
    if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    }
    return time;
};

export const checkIsOpen = (openTime: string, closeTime: string): boolean => {
    if (!openTime || !closeTime) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const openDate = new Date(openTime);
    const closeDate = new Date(closeTime);

    let openMinutes = 0;
    let closeMinutes = 0;

    if (!isNaN(openDate.getTime()) && !isNaN(closeDate.getTime())) {
        openMinutes = openDate.getHours() * 60 + openDate.getMinutes();
        closeMinutes = closeDate.getHours() * 60 + closeDate.getMinutes();
    } else {
        // Fallback parser if strings are like "09:00" or "23:00"
        const [oH, oM] = openTime.split(":").map(Number);
        const [cH, cM] = closeTime.split(":").map(Number);
        openMinutes = (oH || 0) * 60 + (oM || 0);
        closeMinutes = (cH || 0) * 60 + (cM || 0);
    }

    if (openMinutes === closeMinutes) return true; // Open 24 Hours

    // Handles overnight hours (e.g. 11:00 PM to 3:00 AM)
    if (closeMinutes < openMinutes) {
        return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

const OutletCard = ({ outlet, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const isOpen = checkIsOpen(outlet.open_time, outlet.close_time);
    const previewItems = outlet.menu ? outlet.menu.slice(0, 3) : [];

    return (
        <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
            <Card variant="surface" style={styles.cardOverrides}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri:
                                resolveBackendAsset(outlet.image_url) ||
                                "https://placehold.co/800x500?text=Outlet",
                        }}
                        style={styles.image}
                    />

                    <View style={[styles.badge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
                        <Text style={styles.badgeText}>{isOpen ? "OPEN" : "CLOSED"}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{outlet.name}</Text>

                    {!!outlet.description && (
                        <Text
                            numberOfLines={2}
                            style={styles.description}
                        >
                            {outlet.description}
                        </Text>
                    )}

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="location-outline"
                            size={18}
                            color={colors.textSecondary || "#6B7280"}
                        />
                        <Text style={styles.infoText}>
                            {outlet.landmark || "Campus"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="time-outline"
                            size={18}
                            color={colors.textSecondary || "#6B7280"}
                        />
                        <Text style={styles.infoText}>
                            {formatTime(outlet.open_time)} - {formatTime(outlet.close_time)}
                        </Text>
                    </View>

                    <View style={styles.menuRow}>
                        {previewItems.map((item) => (
                            <View key={item.name} style={styles.chip}>
                                <Text style={styles.chipText}>
                                    {item.name} ₹{item.price}
                                </Text>
                            </View>
                        ))}

                        {outlet.menu && outlet.menu.length > 3 && (
                            <View style={styles.moreChip}>
                                <Text style={styles.moreChipText}>
                                    +{outlet.menu.length - 3} more
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default OutletCard;

const getStyles = ({ colors, spacing, typography, radius }: any) =>
    StyleSheet.create({
        cardOverrides: {
            marginBottom: spacing.xl,
            padding: 0,
            overflow: "hidden",
        },

        imageContainer: {
            position: "relative",
        },

        image: {
            width: "100%",
            height: 220,
        },

        badge: {
            position: "absolute",
            right: 14,
            top: 14,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 50,
        },

        badgeOpen: {
            backgroundColor: "#16A34A",
        },

        badgeClosed: {
            backgroundColor: "#DC2626",
        },

        badgeText: {
            color: "#fff",
            fontWeight: "700",
            fontSize: 11,
        },

        content: {
            padding: spacing.lg,
        },

        title: {
            ...typography.h3,
            color: colors.text,
            marginBottom: spacing.sm,
        },

        description: {
            ...typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.md,
        },

        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.sm,
        },

        infoText: {
            marginLeft: spacing.sm,
            ...typography.body,
            color: colors.textSecondary,
        },

        menuRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: spacing.md,
        },

        chip: {
            backgroundColor: colors.primary + "18",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: radius.round,
            marginRight: 8,
            marginBottom: 8,
        },

        chipText: {
            color: colors.primary,
            fontSize: 12,
            fontWeight: "600",
        },

        moreChip: {
            backgroundColor: "#F3F4F6",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: radius.round,
        },

        moreChipText: {
            fontSize: 12,
            fontWeight: "600",
            color: "#6B7280",
        },
    });