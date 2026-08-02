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
        alignItems: "center",
        justifyContent: "space-between",
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: 16,
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