import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Bus, Clock3, ArrowRight } from "lucide-react-native";
import { useTheme } from "@/core/theme";

interface NextBusProps {
    data: {
        vehicle: string;
        departure: string;
        countdown: string;
        from: string;
        to: string;
    } | null;
}

const NextBusHero: React.FC<NextBusProps> = ({ data }) => {
    if (!data) return null;

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.iconContainer}>
                    <Bus
                        size={26}
                        color={colors.surface}
                        strokeWidth={2.2}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>
                        NEXT DEPARTURE
                    </Text>

                    <Text style={styles.vehicle}>
                        {data.vehicle}
                    </Text>
                </View>
            </View>


            <View style={styles.countdownSection}>
                <Text style={styles.leavesIn}>
                    leaves in
                </Text>
                
                <Text style={styles.countdown}>
                    {data.countdown}
                </Text>

                
            </View>

            <View style={styles.routeRow}>
                <Text style={styles.location}>
                    {data.from}
                </Text>

                <ArrowRight
                    size={18}
                    color={colors.surface}
                    strokeWidth={2.5}
                />

                <Text style={styles.location}>
                    {data.to}
                </Text>
            </View>

            <View style={styles.bottomRow}>
                <Clock3
                    size={16}
                    color="rgba(255, 255, 255, 0.75)"
                />

                <Text style={styles.departure}>
                    Departure • {data.departure}
                </Text>
            </View>
        </View>
    );
};

export default NextBusHero;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.primary,
        borderRadius: radius.xl,
        padding: spacing.xl,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: radius.round,
        backgroundColor: "rgba(255, 255, 255, 0.18)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },

    info: {
        flex: 1,
    },

    label: {
        ...typography.label,
        color: "rgba(255, 255, 255, 0.7)",
    },

    vehicle: {
        ...typography.h2,
        color: colors.surface,
        marginTop: 2,
    },

    countdownSection: {
        marginTop: spacing.xl,
        alignItems: "center",
    },

    countdown: {
        ...typography.display,
        fontSize: 52,
        color: colors.surface,
    },

    leavesIn: {
        ...typography.label,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 2,
    },

    routeRow: {
        marginTop: spacing.xl,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.sm,
    },

    location: {
        ...typography.h3,
        color: colors.surface,
    },

    bottomRow: {
        marginTop: spacing.lg,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    departure: {
        ...typography.caption,
        color: "rgba(255, 255, 255, 0.85)",
        marginLeft: spacing.xs,
        fontWeight: "600",
    },
});