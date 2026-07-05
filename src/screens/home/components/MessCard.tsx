import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    UtensilsCrossed,
    Clock3,
    QrCode,
    ChevronRight,
} from "lucide-react-native";

type Meal = {
    mealName: string;
    time: string;
    countdown: string;
    featuredDish: string;
    extraItems: number;
};

type Props = {
    meal: Meal;
    onShowQR: () => void;
    onShowMenu: () => void;
};

const MessCard = ({ onShowQR, onShowMenu }: Props) => {
    // Replace later with API data
    const nextMeal = "Lunch";
    const mealTime = "12:30 PM";
    const countdown = "1 hr 18 min";

    const featuredDish = "Paneer Butter Masala";
    const extraItems = 4;

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconCircle}>
                        <UtensilsCrossed
                            size={22}
                            color="#2563EB"
                            strokeWidth={2.2}
                        />
                    </View>

                    <View>
                        <Text style={styles.mealTitle}>{nextMeal}</Text>

                        <View style={styles.timeRow}>
                            <Clock3
                                size={14}
                                color="#64748B"
                            />

                            <Text style={styles.timeText}>
                                {mealTime} • {countdown}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.featuredContainer}>
                <Text style={styles.featuredDish}>
                    ⭐ {featuredDish}
                </Text>

                <Text style={styles.moreItems}>
                    +{extraItems} more items
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.qrButton}
                    onPress={onShowQR}
                >
                    <QrCode
                        size={18}
                        color="white"
                    />

                    <Text style={styles.qrText}>
                        Show QR
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.menuButton}
                    onPress={onShowMenu}
                >
                    <Text style={styles.menuButtonText}>
                        Weekly Menu
                    </Text>

                    <ChevronRight
                        size={18}
                        color="#2563EB"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MessCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 22,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 10,
        },

        elevation: 6,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#EAF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    featuredContainer: {
        marginTop: 20,
        marginBottom: 4,
    },

    featuredDish: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F172A",
    },

    moreItems: {
        marginTop: 6,
        fontSize: 14,
        color: "#64748B",
    },

    mealTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0F172A",
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    timeText: {
        marginLeft: 6,
        color: "#64748B",
        fontSize: 14,
        fontWeight: "500",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 14,
    },

    qrButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2563EB",
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 16,
    },

    qrText: {
        color: "white",
        fontWeight: "700",
        marginLeft: 8,
        fontSize: 15,
    },

    menuButton: {
        flexDirection: "row",
        alignItems: "center",
    },

    menuButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2563EB",
        marginRight: 4,
    },
});