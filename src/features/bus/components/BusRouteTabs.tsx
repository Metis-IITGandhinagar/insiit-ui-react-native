import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { BusFront } from "lucide-react-native";
import { BusRoute } from "../services/busTypes";
import { useTheme } from "@/core/theme";

interface Props {
    /** Routes discovered in the data, in display order. */
    routes: BusRoute[];
    selected: BusRoute | null;
    onSelect: (route: BusRoute) => void;
}

/**
 * Route switcher: a "Route" caption followed by one pill per route.
 *
 * The route list comes from the API, so it can be any length. The row scrolls
 * horizontally, so pills keep their natural width instead of squeezing as routes are
 * added. A lone route renders as a single non-interactive pill — same styling, since
 * the count should change what's there, not how it looks.
 */
const BusRouteTabs: React.FC<Props> = ({ routes, selected, onSelect }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    if (routes.length === 0) return null;

    const solo = routes.length === 1;

    const pills = routes.map((route) => {
        // The lone route is always shown as the active one: it is what the schedule
        // below is showing, whether or not the selection effect has settled yet.
        const active = solo || selected === route;

        return (
            <TouchableOpacity
                key={route}
                activeOpacity={0.85}
                disabled={solo}
                onPress={() => onSelect(route)}
                style={[styles.pill, active ? styles.activePill : styles.idlePill]}
            >
                <BusFront
                    size={15}
                    color={active ? colors.primary : colors.textSecondary}
                    strokeWidth={2.4}
                />

                <Text
                    numberOfLines={1}
                    style={[styles.pillText, active ? styles.activePillText : styles.idlePillText]}
                >
                    {route}
                </Text>
            </TouchableOpacity>
        );
    });

    // The ScrollView is the whole row, caption included, rather than a scroller nested
    // beside the caption inside a flex row: nested that way it takes its width from its
    // own content, so the pills overflow the screen instead of scrolling.
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // Without this, a tap that drifts a few pixels is swallowed as a scroll.
            keyboardShouldPersistTaps="handled"
            // Claim the gesture as soon as it moves sideways, rather than letting the
            // screen's vertical ScrollView win the ambiguous diagonal drags.
            directionalLockEnabled
            overScrollMode="always"
            style={styles.scroller}
            contentContainerStyle={styles.row}
        >
            <Text style={styles.label}>Route</Text>

            {pills}
        </ScrollView>
    );
};

export default BusRouteTabs;

const getStyles = ({ colors, radius, spacing, typography }: any) => StyleSheet.create({
    /**
     * Full-bleed, so the draggable band spans the whole screen width instead of stopping
     * at the screen's content inset. The negative margins cancel BusScreen's
     * `paddingHorizontal: spacing.lg` and the content container puts it back as padding —
     * keep the two in step if that padding changes.
     */
    scroller: {
        marginHorizontal: -spacing.lg,
        // Vertical slack turns the band from pill-height into something you can grab
        // anywhere in the section, which is the whole point of a scrollable chip row.
        marginVertical: -spacing.sm,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },

    label: {
        ...typography.label,
        fontSize: 12,
        color: colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },

    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.round,
        borderWidth: 1,
    },

    activePill: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primaryLight,
    },

    idlePill: {
        backgroundColor: "transparent",
        borderColor: colors.border,
    },

    pillText: {
        ...typography.caption,
        fontWeight: "800",
        letterSpacing: 0.4,
    },

    activePillText: {
        color: colors.primary,
    },

    idlePillText: {
        color: colors.textSecondary,
    },
});
