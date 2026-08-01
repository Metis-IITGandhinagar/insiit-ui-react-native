import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MapPinned, Circle } from "lucide-react-native";
import { useTheme } from "@/theme";

interface RouteProps {
    stops: string[];
}

const RouteCard: React.FC<RouteProps> = ({ stops }) => {
    if (stops.length === 0) return null;

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <MapPinned
                    size={22}
                    color={colors.primary}
                />

                <Text style={styles.title}>
                    Route Timeline
                </Text>
            </View>

            <View style={styles.timeline}>
                {stops.map((stop, index) => (
                    <View
                        key={`${stop}-${index}`}
                        style={styles.stopRow}
                    >
                        <View style={styles.indicator}>
                            <Circle
                                size={10}
                                color={colors.primary}
                                fill={colors.primary}
                            />

                            {index !== stops.length - 1 && (
                                <View style={styles.line} />
                            )}
                        </View>

                        <Text style={styles.stop}>
                            {stop}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default RouteCard;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        ...shadows.card,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
    },

    title: {
        ...typography.h3,
        marginLeft: spacing.sm,
        color: colors.text,
    },

    timeline: {
        marginLeft: spacing.xs,
    },

    stopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    indicator: {
        width: 20,
        alignItems: "center",
    },

    line: {
        width: 2,
        height: 36,
        backgroundColor: colors.borderSoft,
        marginVertical: spacing.xs,
    },

    stop: {
        marginLeft: spacing.md,
        ...typography.body,
        fontSize: 15,
        color: colors.text,
    },
});