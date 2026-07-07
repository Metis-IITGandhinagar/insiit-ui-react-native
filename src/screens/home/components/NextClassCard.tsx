import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    GraduationCap,
    Clock3,
    MapPin,
    ChevronRight,
} from "lucide-react-native";
import { colors, radius, shadows, spacing, typography } from "@/theme";

type Props = {
    onPress: () => void;
};

const NextClassCard = ({ onPress }: Props) => {
    // Replace with API later
    const subject = "Data Structures";
    const room = "AB 7/101";
    const time = "2:00 PM - 3:20 PM";

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={onPress}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <GraduationCap
                        size={22}
                        color="#7C3AED"
                        strokeWidth={2}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>
                        NEXT CLASS
                    </Text>

                    <Text style={styles.subject}>
                        {subject}
                    </Text>

                    <View style={styles.metaRow}>
                        <Clock3
                            size={14}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.metaText}>
                            {time}
                        </Text>
                    </View>

                    <View style={styles.metaRow}>
                        <MapPin
                            size={14}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.metaText}>
                            {room}
                        </Text>
                    </View>
                </View>
            </View>

            <ChevronRight
                size={22}
                color={colors.inactive
                }
            />
        </TouchableOpacity>
    );
};

export default NextClassCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...shadows.card,
    },

    leftSection: {
        flexDirection: "row",
        flex: 1,
    },

    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: radius.round,
        backgroundColor: "#F3E8FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },

    info: {
        flex: 1,
    },

    label: {
        ...typography.label,
        color: "#7C3AED",
    },

    subject: {
        marginTop: 4,
        ...typography.h3,
        color: colors.text,
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    metaText: {
        marginLeft: 6,
        fontSize: 14,
        color: colors.textSecondary ,
        fontWeight: "500",
    },
});