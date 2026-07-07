import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    MapPinned,
    Circle,
} from "lucide-react-native";

const stops = [
    "Mess",
    "Rangmanch",
    "Research Park",
    "Gate 1",
    "JEET",
];

const RouteCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <MapPinned
                    size={22}
                    color="#2563EB"
                />

                <Text style={styles.title}>
                    Route
                </Text>
            </View>

            <View style={styles.timeline}>
                {stops.map((stop, index) => (
                    <View
                        key={stop}
                        style={styles.stopRow}
                    >
                        <View style={styles.indicator}>
                            <Circle
                                size={12}
                                color="#2563EB"
                                fill="#2563EB"
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

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",

        borderRadius: 24,

        padding: 20,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 4,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        marginBottom: 20,
    },

    title: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
    },

    timeline: {
        marginLeft: 4,
    },

    stopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    indicator: {
        width: 22,
        alignItems: "center",
    },

    line: {
        width: 2,
        height: 34,
        backgroundColor: "#CBD5E1",
        marginVertical: 4,
    },

    stop: {
        marginLeft: 14,
        fontSize: 16,
        fontWeight: "600",
        color: "#334155",
    },
});