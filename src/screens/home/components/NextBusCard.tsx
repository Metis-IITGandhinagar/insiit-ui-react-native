import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Bus,
    Clock3,
    ArrowRight,
    ChevronRight,
} from "lucide-react-native";
import { colors, radius, shadows, spacing, typography } from "@/theme";

type Props = {
    onPress?: () => void;
};

const NextBusCard = ({ onPress }: Props) => {
    // Replace with API later
    const from = "Academic Block";
    const to = "Hostel";
    const departure = "5:40 PM";
    const countdown = "12 min";

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={onPress}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Bus
                        size={22}
                        color="#0F766E"
                        strokeWidth={2}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>
                        NEXT BUS
                    </Text>

                    <View style={styles.routeRow}>
                        <Text style={styles.route}>
                            {from}
                        </Text>

                        <ArrowRight
                            size={15}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.route}>
                            {to}
                        </Text>
                    </View>

                    <View style={styles.timeRow}>
                        <Clock3
                            size={14}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.time}>
                            {departure} • Leaves in {countdown}
                        </Text>
                    </View>
                </View>
            </View>

            <ChevronRight
                size={22}
                color={colors.inactive}
            />
        </TouchableOpacity>
    );
};

export default NextBusCard;

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
        backgroundColor: "#ECFDF5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },

    info: {
        flex: 1,
    },

    label: {
        ...typography.label,
        color: "#0F766E",
    },

    routeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 6,
    },

    route: {
        ...typography.body,
        color: colors.text,
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    time: {
        marginLeft: 6,
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: "500",
    },
});