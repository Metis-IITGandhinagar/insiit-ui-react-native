import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadows, spacing, typography } from "@/theme";
import { Event } from "../types";

interface Props {
    event: Event;
    onPress?: () => void;
    onBookmark?: () => void;
    onDelete?: () => void;
}

const EventCard = ({ event, onPress, onBookmark }: Props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.92}
            style={styles.card}
            onPress={onPress}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: event.image }}
                    style={styles.image}
                />

                <TouchableOpacity
                    style={styles.bookmark}
                    activeOpacity={0.8}
                    onPress={onBookmark}
                >
                    <Ionicons
                        name={event.isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={22}
                        color="#FFF"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text numberOfLines={2} style={styles.title}>
                    {event.title}
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="location-outline"
                        size={18}
                        color="#6B7280"
                    />

                    <Text style={styles.infoText}>{event.venue}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#6B7280"
                    />

                    <Text style={styles.infoText}>
                        {event.date} • {event.time}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default EventCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        marginBottom: spacing.xl,
        ...shadows.card,
        overflow: "hidden",
    },

    imageContainer: {
        position: "relative",
    },

    image: {
        width: "100%",
        height: 210,
    },

    bookmark: {
        position: "absolute",
        top: 14,
        right: 14,

        width: 38,
        height: 38,

        borderRadius: 19,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "rgba(0,0,0,0.35)",
    },

    content: {
        padding: spacing.lg,
    },

    title: {
        ...typography.h3,
        color: colors.text,
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
    footer: {
        marginTop: spacing.md,
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    deleteButton: {
        width: 38,
        height: 38,

        borderRadius: 19,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#FEF2F2",
    },
});