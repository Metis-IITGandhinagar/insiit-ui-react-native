import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BusDeparture } from "../services/busTypes";
import { useTheme } from "@/core/theme";
import { Card } from "@shared/components/Card";

interface ScheduleProps {
    departures: BusDeparture[];
}

/**
 * The day's departures, upcoming first and already-departed ones below a divider.
 *
 * Each row puts the route on its own full-width line rather than beside the time:
 * stop names here run to ~22 characters ("Pathikashram Terminal"), so a side-by-side
 * time/route row either collides or runs off the screen edge on a phone.
 */
const TodaySchedule: React.FC<ScheduleProps> = ({ departures }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    if (departures.length === 0) return null;

    const upcomingCount = departures.filter(bus => !bus.passed).length;

    return (
        <Card variant="surface">
            <View style={styles.header}>
                <Text style={styles.heading}>Today's Schedule</Text>

                <Text style={styles.count}>
                    {upcomingCount} left
                </Text>
            </View>

            {departures.map((bus, idx) => {
                // The list is sorted upcoming-then-passed, so the first passed row is
                // where "Earlier today" belongs.
                const startsPassedSection = bus.passed && idx === upcomingCount;
                // Skip the hairline on the last row, and on the row just above the
                // "Earlier today" divider so the two lines don't stack.
                const showDivider =
                    idx !== departures.length - 1 &&
                    !(upcomingCount > 0 && idx === upcomingCount - 1);

                return (
                    <View key={`${bus.time}-${bus.from}-${idx}`}>
                        {startsPassedSection && (
                            <View style={styles.sectionDivider}>
                                <View style={styles.sectionLine} />
                                <Text style={styles.sectionLabel}>Earlier today</Text>
                                <View style={styles.sectionLine} />
                            </View>
                        )}

                        <View
                            style={[
                                styles.row,
                                showDivider && styles.rowDivider,
                                bus.isNext && styles.nextRow,
                                bus.passed && styles.passedRow,
                            ]}
                        >
                            {/* No numberOfLines: let long stop pairs wrap in full
                              * rather than ellipsize. */}
                            <Text style={[styles.route, bus.passed && styles.passedText]}>
                                {bus.from}
                                <Text style={styles.arrow}>{"  →  "}</Text>
                                {bus.to}
                            </Text>

                            <View style={styles.metaRow}>
                                <Text style={[styles.time, bus.isNext && styles.nextTime, bus.passed && styles.passedText]}>
                                    {bus.time}
                                </Text>

                                {bus.isNext ? (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>NEXT</Text>
                                    </View>
                                ) : (
                                    <Text style={[styles.countdown, bus.passed && styles.passedText]}>
                                        {bus.passed
                                            ? "Departed"
                                            : bus.countdown === "Now"
                                                ? "Now"
                                                : `in ${bus.countdown}`}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                );
            })}
        </Card>
    );
};

export default TodaySchedule;

const getStyles = ({ colors, radius, spacing, typography }: any) => StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.sm,
    },

    heading: {
        ...typography.h3,
        color: colors.text,
    },

    count: {
        ...typography.caption,
        fontSize: 13,
        fontWeight: "600",
        color: colors.textSecondary,
    },

    row: {
        paddingVertical: spacing.md,
        gap: 6,
    },

    // colors.border, not the colors.borderSoft this used to reference — that token
    // doesn't exist on the theme, so the hairlines fell back to opaque black.
    rowDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },

    nextRow: {
        backgroundColor: colors.primaryLight,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        marginHorizontal: -spacing.sm,
        marginVertical: spacing.xs,
        borderBottomWidth: 0,
    },

    passedRow: {
        opacity: 0.55,
    },

    route: {
        ...typography.caption,
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
        lineHeight: 21,
    },

    arrow: {
        color: colors.textSecondary,
        fontWeight: "600",
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    time: {
        ...typography.caption,
        fontSize: 13,
        fontWeight: "600",
        color: colors.textSecondary,
    },

    nextTime: {
        color: colors.primary,
        fontWeight: "700",
    },

    countdown: {
        ...typography.caption,
        fontSize: 13,
        fontWeight: "500",
        color: colors.textSecondary,
    },

    passedText: {
        color: colors.textSecondary,
    },

    badge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radius.sm,
    },

    badgeText: {
        ...typography.label,
        fontSize: 10,
        color: colors.onPrimary,
    },

    sectionDivider: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },

    sectionLine: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },

    sectionLabel: {
        ...typography.label,
        fontSize: 11,
        color: colors.textSecondary,
        textTransform: "uppercase",
    },
});
