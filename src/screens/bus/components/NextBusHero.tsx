import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    Bus,
    Clock3,
    ArrowRight,
} from "lucide-react-native";

const NextBusHero = () => {
    // Replace with API/service later
    const vehicle = "EECO Shuttle";
    const departure = "8:00 AM";
    const countdown = "8 min";
    const from = "Mess";
    const to = "JEET";

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.iconContainer}>
                    <Bus
                        size={30}
                        color="#2563EB"
                        strokeWidth={2.2}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>
                        NEXT DEPARTURE
                    </Text>

                    <Text style={styles.vehicle}>
                        {vehicle}
                    </Text>
                </View>
            </View>

            <View style={styles.countdownSection}>
                <Text style={styles.countdown}>
                    {countdown}
                </Text>

                <Text style={styles.leavesIn}>
                    leaves in
                </Text>
            </View>

            <View style={styles.routeRow}>
                <Text style={styles.location}>
                    {from}
                </Text>

                <ArrowRight
                    size={18}
                    color="#64748B"
                />

                <Text style={styles.location}>
                    {to}
                </Text>
            </View>

            <View style={styles.bottomRow}>
                <Clock3
                    size={16}
                    color="#64748B"
                />

                <Text style={styles.departure}>
                    Departure • {departure}
                </Text>
            </View>
        </View>
    );
};

export default NextBusHero;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2563EB",
        borderRadius: 28,
        padding: 24,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "rgba(255,255,255,0.15)",

        justifyContent: "center",
        alignItems: "center",

        marginRight: 16,
    },

    info: {
        flex: 1,
    },

    label: {
        color: "#DCEAFE",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },

    vehicle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "800",
        marginTop: 4,
    },

    countdownSection: {
        marginTop: 28,
        alignItems: "center",
    },

    countdown: {
        color: "#FFFFFF",
        fontSize: 48,
        fontWeight: "800",
    },

    leavesIn: {
        color: "#DBEAFE",
        fontSize: 16,
        marginTop: 4,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    routeRow: {
        marginTop: 30,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        gap: 10,
    },

    location: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    bottomRow: {
        marginTop: 24,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    departure: {
        color: "#DBEAFE",
        fontSize: 15,
        marginLeft: 8,
        fontWeight: "600",
    },
});