// src/features/bus/components/NextBusHero.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Bus, Clock3 } from "lucide-react-native";
import { useTheme } from "@core/theme";
import { Card } from "@shared/components/Card";

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
        <Card variant="primary">
            <View style={styles.topRow}>
                <View style={styles.iconContainer}>
                    <Bus
                        size={26}
                        color={colors.onPrimary}
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

                <View style={styles.departureRow}>
                    <Clock3
                        size={16}
                        color="rgba(255, 255, 255, 0.75)"
                    />

                    <Text style={styles.departure}>
                        Departure • {data.departure}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/*
              * From and to are stacked, not side by side: stop names run to ~22
              * characters, which overflowed the card edge when laid out in one row.
              */}
            <View style={styles.legRow}>
                <Text style={styles.legLabel}>FROM</Text>

                <Text style={styles.location} numberOfLines={2}>
                    {data.from}
                </Text>
            </View>

            <View style={styles.legRow}>
                <Text style={styles.legLabel}>TO</Text>

                <Text style={styles.location} numberOfLines={2}>
                    {data.to}
                </Text>
            </View>
        </Card>
    );
};

export default NextBusHero;

const getStyles = ({ colors, radius, spacing, typography }: any) => StyleSheet.create({
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
        color: colors.onPrimary,
        marginTop: 2,
    },

    countdownSection: {
        marginTop: spacing.xl,
        alignItems: "center",
    },

    countdown: {
        ...typography.display,
        fontSize: 52,
        color: colors.onPrimary,
    },

    leavesIn: {
        ...typography.label,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 2,
    },

    divider: {
        marginTop: spacing.xl,
        height: StyleSheet.hairlineWidth,
        backgroundColor: "rgba(255, 255, 255, 0.28)",
    },

    legRow: {
        marginTop: spacing.md,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: spacing.sm,
    },

    legLabel: {
        ...typography.label,
        fontSize: 11,
        width: 42,
        paddingTop: 3,
        color: "rgba(255, 255, 255, 0.6)",
    },

    location: {
        ...typography.h3,
        flex: 1,
        color: colors.onPrimary,
    },

    departureRow: {
        marginTop: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },

    departure: {
        ...typography.caption,
        color: "rgba(255, 255, 255, 0.85)",
        fontWeight: "600",
    },
});