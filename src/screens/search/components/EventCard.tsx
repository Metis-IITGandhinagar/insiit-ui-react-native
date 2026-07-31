import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Card from "@/components/Card";
import { Event } from "../types";

interface Props {
    event: Event;
    onPress?: () => void;
    onBookmark?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const EventCard = ({ event, onPress, onBookmark, onEdit, onDelete }: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <Card padding={0} onPress={onPress} style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: event.image }}
                    style={styles.image}
                />

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

                {/* Management Utility Buttons (Open to all for testing right now) */}
                <View style={styles.footer}>
                    {onEdit && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={(e) => { e.stopPropagation(); onEdit(); }}
                        >
                            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Card>
    );
};

export default EventCard;

const getStyles = ({ colors, spacing, typography, layout }: any) => StyleSheet.create({
    card: {
        marginBottom: layout.listItemGap,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: 300,
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
        gap: spacing.md,
    },
    actionButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
    },
    editButton: {
        backgroundColor: "#EFF6FF",
    },
    deleteButton: {
        backgroundColor: "#FEF2F2",
    },
});