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
import { LostFoundEntry } from "../services/lostFoundTypes";
import { formatRelativeDate } from "../utils/formatDate";

interface Props {
    entry: LostFoundEntry;
    onPress?: () => void;
}

const STATUS_LABEL: Record<LostFoundEntry["status"], string> = {
    lost: "Lost",
    claimed_to_be_found: "Claim Pending",
    found: "Found",
};

function getStatusColor(status: LostFoundEntry["status"], colors: any) {
    switch (status) {
        case "lost":
            return colors.danger ?? "#DC2626";
        case "claimed_to_be_found":
            return colors.warning ?? "#F59E0B";
        case "found":
            return colors.success ?? "#16A34A";
        default:
            return colors.textSecondary ?? "#6B7280";
    }
}

const LostFoundCard = ({ entry, onPress }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const statusColor = getStatusColor(entry.status, colors);
    const claimCount = entry.found_claims?.length ?? 0;
    const image =
        entry.img_urls?.[0]
            ? entry.img_urls[0].startsWith("http")
                ? entry.img_urls[0]
                : `https://insiit-api-rust.metis-iitgn.tech/${entry.img_urls[0]}`
            : "https://placehold.co/800x500?text=Lost+%26+Found";
    return (
        <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
            <Card variant="surface" style={styles.cardOverrides}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: image}}
                        style={styles.image}
                    />

                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: statusColor },
                        ]}
                    >
                        <Text style={styles.badgeText}>
                            {STATUS_LABEL[entry.status].toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>{entry.item_name}</Text>

                    {!!entry.description && (
                        <Text
                            numberOfLines={2}
                            style={styles.description}
                        >
                            {entry.description}
                        </Text>
                    )}

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color={colors.textSecondary}
                        />
                        <Text style={styles.infoText}>
                            {formatRelativeDate(
                                entry.added_on_timestamp
                            )}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="mail-outline"
                            size={16}
                            color={colors.textSecondary}
                        />
                        <Text style={styles.infoText} numberOfLines={1}>
                            {entry.added_by_email}
                        </Text>
                    </View>

                    {claimCount > 0 && (
                        <View style={styles.claimChip}>
                            <Text style={styles.claimChipText}>
                                {claimCount} claim
                                {claimCount > 1 ? "s" : ""} submitted
                            </Text>
                        </View>
                    )}
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default LostFoundCard;

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
            height: 200,
            backgroundColor: colors.border,
        },

        badge: {
            position: "absolute",
            right: 14,
            top: 14,
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

        claimChip: {
            alignSelf: "flex-start",
            backgroundColor: colors.primary + "18",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: radius.round,
            marginTop: spacing.sm,
        },

        claimChipText: {
            color: colors.primary,
            fontSize: 12,
            fontWeight: "600",
        },
    });