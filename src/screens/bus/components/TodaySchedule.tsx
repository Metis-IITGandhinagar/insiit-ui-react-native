import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    Clock3,
    ArrowRight,
} from "lucide-react-native";

const departures = [
    {
        time: "7:50 AM",
        from: "Mess",
        to: "JEET",
        next: false,
    },
    {
        time: "8:00 AM",
        from: "JEET",
        to: "Mess",
        next: true,
    },
    {
        time: "10:00 AM",
        from: "Mess",
        to: "JEET",
        next: false,
    },
    {
        time: "10:30 AM",
        from: "JEET",
        to: "Mess",
        next: false,
    },
    {
        time: "11:00 AM",
        from: "Mess",
        to: "JEET",
        next: false,
    },
];

const TodaySchedule = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>
                Today's Schedule
            </Text>

            {departures.map((bus) => (
                <View
                    key={`${bus.time}-${bus.from}`}
                    style={[
                        styles.row,
                        bus.next && styles.nextRow,
                    ]}
                >
                    <View style={styles.left}>
                        <Clock3
                            size={16}
                            color={bus.next ? "#2563EB" : "#64748B"}
                        />

                        <Text
                            style={[
                                styles.time,
                                bus.next && styles.nextTime,
                            ]}
                        >
                            {bus.time}
                        </Text>
                    </View>

                    <View style={styles.route}>
                        <Text style={styles.place}>
                            {bus.from}
                        </Text>

                        <ArrowRight
                            size={14}
                            color="#64748B"
                        />

                        <Text style={styles.place}>
                            {bus.to}
                        </Text>
                    </View>

                    {bus.next && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                NEXT
                            </Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

export default TodaySchedule;

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

    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 18,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingVertical: 14,

        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },

    nextRow: {
        backgroundColor: "#EFF6FF",
        borderRadius: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 0,
        marginBottom: 8,
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        width: 95,
    },

    time: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "600",
        color: "#334155",
    },

    nextTime: {
        color: "#2563EB",
    },

    route: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },

    place: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A",
    },

    badge: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },

    badgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "700",
    },
});