import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { UtensilsCrossed, X } from "lucide-react-native";
import { useTheme } from "@/theme";
import { MessMenuResponse, DayMenu } from "../services/mess/messTypes";

export type WeeklyMenuSheetRef = {
    expand: () => void;
    close: () => void;
};

type Props = {
    data: MessMenuResponse | null;
};

const DAY_MAPPINGS = [
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
    { label: "Sun", value: 7 }
];

const WeeklyMenuSheet = forwardRef<WeeklyMenuSheetRef, Props>(({ data }, ref) => {
    const [visible, setVisible] = useState(false);
    const [selectedDayValue, setSelectedDayValue] = useState<number>(1);

    useImperativeHandle(ref, () => ({
        expand() { setVisible(true); },
        close() { setVisible(false); },
    }));

    useEffect(() => {
        if (visible) {
            const systemIndex = new Date().getDay();
            const activeMatch = systemIndex === 0 ? 7 : systemIndex;
            setSelectedDayValue(activeMatch);
        }
    }, [visible]);

    const activeDayData = data?.mess?.find(m => m.day === selectedDayValue);

    const renderFoodBlock = (title: string, rawText: string | undefined) => {
        const items = (rawText || "").split("\n")
            .map(t => t.trim())
            .filter(t => t !== "" && t !== "–");

        return (
            <View style={styles.mealCardSection}>
                <Text style={styles.sectionMealTitle}>{title}</Text>
                <View style={styles.itemsWrapperList}>
                    {items.length > 0 ? (
                        items.map((food, i) => (
                            <Text key={i} style={styles.foodTextNode}>• {food}</Text>
                        ))
                    ) : (
                        <Text style={styles.emptyItemsText}>– Standard Service Dynamic Break</Text>
                    )}
                </View>
            </View>
        );
    };
    
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
            <View style={styles.absoluteWrap}>
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                    <Pressable style={styles.dismissCatch} onPress={() => setVisible(false)} />
                </BlurView>

                <View style={styles.sheetCore}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <UtensilsCrossed size={22} color={colors.primary} />
                            <Text style={styles.title}>{data?.mess_name || "Hostel Mess"} Schedule</Text>
                        </View>
                        <Pressable onPress={() => setVisible(false)}>
                            <X size={22} color={colors.textSecondary} />
                        </Pressable>
                    </View>

                    {/* Day Navigator Track */}
                    <View style={styles.tabScrollWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                            {DAY_MAPPINGS.map((d) => {
                                const isActive = d.value === selectedDayValue;
                                return (
                                    <Pressable
                                        key={d.value}
                                        style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                                        onPress={() => setSelectedDayValue(d.value)}
                                    >
                                        <Text style={[styles.tabLabelText, isActive && styles.tabLabelTextActive]}>
                                            {d.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Safe Context Render Stack View Loop */}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mealScrollContent}>
                        {activeDayData ? (
                            <View style={styles.cardsStackContainer}>
                                {renderFoodBlock("Breakfast", activeDayData.breakfast)}
                                {renderFoodBlock("Lunch", activeDayData.lunch)}
                                {renderFoodBlock("Snacks", activeDayData.snacks)}
                                {renderFoodBlock("Dinner", activeDayData.dinner)}
                            </View>
                        ) : (
                            <View style={styles.fallbackBox}>
                                <Text style={styles.fallbackText}>No records parsed for the targeted timeline parameters.</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
});

export default WeeklyMenuSheet;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    absoluteWrap: {
        flex: 1,
        justifyContent: "flex-end",
    },
    dismissCatch: {
        flex: 1,
    },
    sheetCore: {
        width: "100%",
        height: "85%",
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        padding: spacing.xl,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    tabScrollWrapper: {
        marginBottom: spacing.lg,
        height: 44,
    },
    tabsContainer: {
        gap: 8,
        alignItems: "center",
    },
    tabBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceAlt,
    },
    tabBtnActive: {
        backgroundColor: colors.primary,
    },
    tabLabelText: {
        ...typography.label,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    tabLabelTextActive: {
        color: colors.surface,
    },
    mealScrollContent: {
        paddingBottom: 40,
    },
    cardsStackContainer: {
        gap: 16,
    },
    mealCardSection: {
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    sectionMealTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
        paddingBottom: 6,
    },
    itemsWrapperList: {
        gap: 4,
    },
    foodTextNode: {
        ...typography.body,
        color: colors.text,
        lineHeight: 20,
    },
    emptyItemsText: {
        color: colors.inactive,
        fontStyle: "italic",
        fontSize: 13,
    },
    fallbackBox: {
        padding: spacing.xl,
        alignItems: "center",
    },
    fallbackText: {
        color: colors.textSecondary,
    },
});