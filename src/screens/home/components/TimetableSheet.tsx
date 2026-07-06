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
import { CalendarDays, X } from "lucide-react-native";
import { colors } from "@/theme";

export type TimetableSheetRef = {
    expand: () => void;
    close: () => void;
};

const timetable = [
    {
        day: "Monday",
        classes: [
            "09:00 - DSA",
            "11:00 - CN",
            "14:00 - DBMS",
        ],
    },
    {
        day: "Tuesday",
        classes: [
            "10:00 - Maths",
            "13:00 - AI",
        ],
    },
    {
        day: "Wednesday",
        classes: [
            "09:00 - DSA",
            "15:00 - Lab",
        ],
    },
    {
        day: "Thursday",
        classes: [
            "10:00 - CN",
            "14:00 - DBMS",
        ],
    },
    {
        day: "Friday",
        classes: [
            "09:00 - AI",
            "11:00 - Seminar",
        ],
    },
];

const TimetableSheet = forwardRef<TimetableSheetRef>((_, ref) => {
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
            transparent
            animationType="slide"
        >
            <Pressable
                style={styles.overlay}
                onPress={() => setVisible(false)}
            />

            <View style={styles.sheet}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <CalendarDays
                            size={22}
                            color={colors.primary}
                        />

                        <Text style={styles.title}>
                            Weekly Timetable
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => setVisible(false)}
                    >
                        <X size={22} color={colors.textSecondary}/>
                    </Pressable>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {timetable.map((day) => (
                        <View
                            key={day.day}
                            style={styles.dayCard}
                        >
                            <Text style={styles.day}>
                                {day.day}
                            </Text>

                            {day.classes.map((item) => (
                                <Text
                                    key={item}
                                    style={styles.classItem}
                                >
                                    • {item}
                                </Text>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
});

export default TimetableSheet;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "72%",

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

    titleRow: {
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

        marginBottom: 14,
    },

    day: {
        fontSize: 18,
        fontWeight: "700",

        marginBottom: 10,

        color: colors.primary,
    },

    classItem: {
        fontSize: 15,
        color: "#334155",
        marginBottom: 6,
    },
});