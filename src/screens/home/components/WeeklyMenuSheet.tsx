import React, {
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    UtensilsCrossed,
    X,
} from "lucide-react-native";
import { colors } from "@/theme";

export type WeeklyMenuSheetRef = {
    expand: () => void;
    close: () => void;
};


const weeklyMenu = [
    {
        day: "Monday",
        meals: {
            Breakfast: "Poha, Tea, Banana",
            Lunch: "Paneer Butter Masala, Dal, Rice, Roti",
            Snacks: "Samosa, Tea",
            Dinner: "Veg Biryani, Raita",
        },
    },
    {
        day: "Tuesday",
        meals: {
            Breakfast: "Idli, Sambar",
            Lunch: "Rajma, Rice, Roti",
            Snacks: "Sandwich",
            Dinner: "Chole Bhature",
        },
    },
    {
        day: "Wednesday",
        meals: {
            Breakfast: "Upma",
            Lunch: "Mix Veg, Dal",
            Snacks: "Biscuits, Tea",
            Dinner: "Pulao, Kadhi",
        },
    },
    {
        day: "Thursday",
        meals: {
            Breakfast: "Paratha, Curd",
            Lunch: "Aloo Gobi, Dal",
            Snacks: "Puffs",
            Dinner: "Pav Bhaji",
        },
    },
    {
        day: "Friday",
        meals: {
            Breakfast: "Dosa",
            Lunch: "Shahi Paneer",
            Snacks: "Maggi",
            Dinner: "Noodles, Manchurian",
        },
    },
    {
        day: "Saturday",
        meals: {
            Breakfast: "Bread Omelette (Veg Alt)",
            Lunch: "Dal Tadka",
            Snacks: "Pakoda",
            Dinner: "Pizza",
        },
    },
    {
        day: "Sunday",
        meals: {
            Breakfast: "Poori Bhaji",
            Lunch: "Special Thali",
            Snacks: "Ice Cream",
            Dinner: "Pasta",
        },
    },
];

const WeeklyMenuSheet = forwardRef<WeeklyMenuSheetRef>((_, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        expand() {
            setVisible(true);
        },
        close() {
            setVisible(false);
        },
    }));

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            <Pressable
                style={styles.overlay}
                onPress={() => setVisible(false)}
            />

            <View style={styles.sheet}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <UtensilsCrossed
                            size={22}
                            color={colors.primary}
                        />

                        <Text style={styles.title}>
                            Weekly Mess Menu
                        </Text>
                    </View>

                    <Pressable onPress={() => setVisible(false)}>
                        <X
                            size={22}
                            color={colors.textSecondary}
                        />
                    </Pressable>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {weeklyMenu.map((day) => (
                        <View
                            key={day.day}
                            style={styles.dayCard}
                        >
                            <Text style={styles.day}>
                                {day.day}
                            </Text>

                            {Object.entries(day.meals).map(([meal, menu]) => (
                                <View
                                    key={meal}
                                    style={styles.mealRow}
                                >
                                    <Text style={styles.meal}>
                                        {meal}
                                    </Text>

                                    <Text style={styles.menu}>
                                        {menu}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
});

export default WeeklyMenuSheet;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "82%",

        backgroundColor: "#FFF",

        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        padding: 24,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        marginBottom: 20,
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        marginLeft: 10,
        fontSize: 22,
        fontWeight: "700",
        color: "#0F172A",
    },

    dayCard: {
        backgroundColor: "#F8FAFC",

        borderRadius: 18,

        padding: 18,

        marginBottom: 16,
    },

    day: {
        fontSize: 19,
        fontWeight: "700",

        color: colors.primary,

        marginBottom: 14,
    },

    mealRow: {
        marginBottom: 14,
    },

    meal: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 3,
    },

    menu: {
        fontSize: 14,
        color:colors.textSecondary,
        lineHeight: 20,
    },
});