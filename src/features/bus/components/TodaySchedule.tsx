import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clock3, ArrowRight } from "lucide-react-native";
import { BusDeparture } from "../services/busTypes";
import { useTheme } from "@/core/theme";
import { Card } from "@shared/components/Card"; 
interface ScheduleProps {
    departures: BusDeparture[];
}

const TodaySchedule: React.FC<ScheduleProps> = ({ departures }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <Card variant="surface" style={styles.cardOverrides}>
            <Text style={styles.heading}>
                Today's Schedule
            </Text>

            {departures.map((bus, idx) => (
                <View
                    key={`${bus.time}-${bus.from}-${idx}`}
                    style={[
                        styles.row,
                        bus.isNext && styles.nextRow,
                    ]}
                >
                    <View style={styles.left}>
                        <Clock3
                            size={16}
                            color={bus.isNext ? colors.primary : colors.textSecondary}
                        />
                        <Text style={[styles.time, bus.isNext && styles.nextTime]}>
                            {bus.time}
                        </Text>
                    </View>

                    <View style={styles.route}>
                        <Text style={styles.place}>{bus.from}</Text>
                        <ArrowRight size={14} color={colors.textSecondary} />
                        <Text style={styles.place}>{bus.to}</Text>
                    </View>    
                </View>
            ))}
        </Card>
    );
};

export default TodaySchedule;

const getStyles = ({ colors, radius, spacing, typography }: any) => StyleSheet.create({
    cardOverrides: {
        padding: spacing.lg,
    },
    heading: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSoft,
    },
    nextRow: {
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.md,
        paddingHorizontal: spacing.sm,
        borderBottomWidth: 0,
        marginVertical: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        width: 100,
    },
    time: {
        ...typography.caption,
        marginLeft: spacing.sm,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    nextTime: {
        color: colors.primary,
        fontWeight: "700",
    },
    route: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.xs,
    },
    place: {
        ...typography.caption,
        fontWeight: "700",
        color: colors.text,
    },
    badge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    badgeText: {
        color: colors.surface,
        ...typography.label,
        fontSize: 10,
    },
});