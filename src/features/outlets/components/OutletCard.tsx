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
import { Outlet } from "../services/outletTypes";

interface Props {
    outlet: Outlet;
    onPress?: () => void;
}

const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

const OutletCard = ({ outlet, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const previewItems = outlet.menu.slice(0, 3);

    return (
        <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
            <Card variant="surface" style={styles.cardOverrides}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri:
                                outlet.image_url ||
                                "https://placehold.co/800x500?text=Outlet",
                        }}
                        style={styles.image}
                    />

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>OPEN</Text>
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
                            color="#6B7280"
                        />
                        <Text style={styles.infoText}>
                            {outlet.landmark || "Campus"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="time-outline"
                            size={18}
                            color="#6B7280"
                        />
                        <Text style={styles.infoText}>
                            {formatTime(outlet.open_time)} -{" "}
                            {formatTime(outlet.close_time)}
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

                        {outlet.menu.length > 3 && (
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
            backgroundColor: "#16A34A",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 50,
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