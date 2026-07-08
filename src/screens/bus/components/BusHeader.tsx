import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import { spacing } from "@/theme";

const BusHeader = () => {
    return (
        <View style={styles.container}>
            
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Bus Services
                </Text>

                <Text style={styles.subtitle}>
                    Live schedules & departures
                </Text>
            </View>

        </View>
    );
};

export default BusHeader;

const styles = StyleSheet.create({
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
        color: "#0F172A",
    },

    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: "#64748B",
        fontWeight: "500",
    },

    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,

        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },
});