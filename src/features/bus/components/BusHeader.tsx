// src/features/bus/components/BusHeader.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@core/theme";

const BusHeader = () => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Bus Services</Text>
                <Text style={styles.subtitle}>Live schedules & departures</Text>
            </View>
        </View>
    );
};

export default BusHeader;

const getStyles = ({ colors, spacing }: any) => StyleSheet.create({
    container: {
        paddingTop: spacing.lg,
        // Left-aligned, not centred: `alignItems: "center"` on a lone flex:1 child
        // pushed the title into the middle, under the top-right control.
        alignItems: "flex-start",
    },
    titleContainer: {
        // The screen already applies horizontal padding; the extra 16 here inset the
        // title past every card below it. Reserve room for the top-right control instead.
        alignSelf: "stretch",
        paddingRight: 56,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.text || "#0F172A",
    },
    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: colors.textSecondary || "#64748B",
        fontWeight: "500",
    },
});