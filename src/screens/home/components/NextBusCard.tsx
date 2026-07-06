import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Bus,
    Clock3,
    ArrowRight,
    ChevronRight,
} from "lucide-react-native";
import { colors } from "@/theme";

type Props = {
    onPress?: () => void;
};

const NextBusCard = ({ onPress }: Props) => {
    // Replace with API later
    const from = "Academic Block";
    const to = "Hostel";
    const departure = "5:40 PM";
    const countdown = "12 min";

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={onPress}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Bus
                        size={22}
                        color="#0F766E"
                        strokeWidth={2}
                    />
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>
                        NEXT BUS
                    </Text>

                    <View style={styles.routeRow}>
                        <Text style={styles.route}>
                            {from}
                        </Text>

                        <ArrowRight
                            size={15}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.route}>
                            {to}
                        </Text>
                    </View>

                    <View style={styles.timeRow}>
                        <Clock3
                            size={14}
                            color={colors.textSecondary}
                        />

                        <Text style={styles.time}>
                            {departure} • Leaves in {countdown}
                        </Text>
                    </View>
                </View>
            </View>

            <ChevronRight
                size={22}
                color={colors.inactive}
            />
        </TouchableOpacity>
    );
};

export default NextBusCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 18,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 5,
    },

    leftSection: {
        flexDirection: "row",
        flex: 1,
    },

    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#ECFDF5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    info: {
        flex: 1,
    },

    label: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0F766E",
        letterSpacing: 1,
    },

    routeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 6,
    },

    route: {
        fontSize: 15,
        fontWeight: "700",
        color: "#000000",
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    time: {
        marginLeft: 6,
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: "500",
    },
});