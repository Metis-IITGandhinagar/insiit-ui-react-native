import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UtensilsCrossed, Clock3, QrCode, ChevronDown } from "lucide-react-native";
import { useTheme } from "@/theme";
import { ActiveMealState } from "../services/mess/messTypes";

// 1. Keep your existing Props definition
type Props = {
    meal: ActiveMealState | null;
    onShowQR: () => void;
    onShowMenu: () => void;
};

// 2. Define the new TypeScript type for the 3 rows
type PrioritizedItems = {
    item1: string;
    item2: string;
    item3: string;
};

// 3. 🛠️ ADD STEP 1 CODE HERE (Outside the main component block)
const getMealHighlights = (mealName: string, itemsList: string[]): PrioritizedItems => {
    const defaultData = { item1: "Menu Standby", item2: "-", item3: "-" };
    if (!itemsList || itemsList.length === 0) return defaultData;

    const normalizedName = mealName.toLowerCase();

    // Breakfast: Breakfast Meal (Index 0), Side Item (Index 1), Fruit (Index 9)
    if (normalizedName.includes("breakfast")) {
        return {
            item1: itemsList[0] || "-",
            item2: itemsList[1] || "-",
            item3: itemsList[9] || "-",
        };
    }

    // Lunch: Dal (Index 1), Legume Curry (Index 2), Vegetable (Index 3)
    if (normalizedName.includes("lunch")) {
        return {
            item1: itemsList[1] || "-",
            item2: itemsList[2] || "-",
            item3: itemsList[3] || "-",
        };
    }

    // Snacks: Snacks (Index 0), Cold Beverage (Index 2), Dips/Chutney (Index 1)
    if (normalizedName.includes("snack")) {
        return {
            item1: itemsList[0] || "-",
            item2: itemsList[2] || "-",
            item3: itemsList[1] || "-",
        };
    }

    // Dinner: Vegetable (Index 2), Non-Veg Item (Index 7), Special Item (Index 6)
    if (normalizedName.includes("dinner")) {
        return {
            item1: itemsList[2] || "-",
            item2: itemsList[7] && itemsList[7] !== "-" ? itemsList[7] : "Standard Day Option",
            item3: itemsList[6] || "-",
        };
    }

    return defaultData;
};

// 4. Your main component continues below as usual...
const MessCard = ({ meal, onShowQR, onShowMenu }: Props) => {
    if (!meal) return null;

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const MAX_FONT_SCALE = 1.3;
    const isServingNow = meal.countdown === "Serving Now";

    // Extract exact targeted items for the current active meal window
    const highlights = getMealHighlights(meal.mealName, meal.itemsList);

    return (
        <View style={styles.card}>
            {/* Top Layout Track */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconCircle}>
                        <UtensilsCrossed size={22} color={colors.primary} strokeWidth={2.2} />
                    </View>

                    <View style={styles.headerTextContainer}>
                        <Text
                            style={styles.mealTitle}
                            numberOfLines={1}
                            maxFontSizeMultiplier={MAX_FONT_SCALE}
                        >
                            {meal.mealName}
                        </Text>

                        <View style={styles.timeRow}>
                            <Clock3 size={13} color={colors.textSecondary} style={styles.clockIcon} />
                            <Text
                                style={styles.timeText}
                                numberOfLines={1}
                                maxFontSizeMultiplier={MAX_FONT_SCALE}
                            >
                                {meal.timeWindow}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Status Badge */}
                <View style={[styles.badge, isServingNow ? styles.badgeActive : styles.badgeClosing]}>
                    <Text
                        style={[styles.badgeText, isServingNow ? styles.badgeTextActive : styles.badgeTextClosing]}
                        numberOfLines={1}
                        maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                        {meal.countdown}
                    </Text>
                </View>
            </View>

            {/* 📋 Updated: 3 Vertically Stacked Clean Bullet List Items */}
            <View style={styles.menuContainer}>
                <View style={styles.bulletRow}>
                    <Text style={styles.bulletDot} maxFontSizeMultiplier={MAX_FONT_SCALE}>•</Text>
                    <Text style={styles.menuText} numberOfLines={1} maxFontSizeMultiplier={MAX_FONT_SCALE}>
                        {highlights.item1}
                    </Text>
                </View>

                <View style={styles.bulletRow}>
                    <Text style={styles.bulletDot} maxFontSizeMultiplier={MAX_FONT_SCALE}>•</Text>
                    <Text style={styles.menuText} numberOfLines={1} maxFontSizeMultiplier={MAX_FONT_SCALE}>
                        {highlights.item2}
                    </Text>
                </View>

                <View style={styles.bulletRow}>
                    <Text style={styles.bulletDot} maxFontSizeMultiplier={MAX_FONT_SCALE}>•</Text>
                    <Text style={styles.menuText} numberOfLines={1} maxFontSizeMultiplier={MAX_FONT_SCALE}>
                        {highlights.item3}
                    </Text>
                </View>
            </View>

            {/* Bottom Interactive Area */}
            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.qrButton}
                    onPress={onShowQR}
                    accessibilityRole="button"
                >
                    <QrCode size={18} color="white" />
                    <Text style={styles.qrText} maxFontSizeMultiplier={MAX_FONT_SCALE}>Show QR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.menuButton}
                    onPress={onShowMenu}
                    accessibilityRole="button"
                    hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                >
                    <Text style={styles.menuButtonText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
                        Weekly Menu
                    </Text>
                    <ChevronDown size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MessCard;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.xl,
        ...shadows.card,
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: spacing.sm,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: radius.round || 24,
        backgroundColor: colors.primaryLight || "#EAF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
        flexShrink: 0,
    },
    headerTextContainer: {
        flex: 1,
    },
    mealTitle: {
        ...typography.h2,
        color: colors.text,
        fontWeight: "700",
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    clockIcon: {
        marginRight: 4,
        flexShrink: 0,
    },
    timeText: {
        color: colors.textSecondary,
        ...typography.caption,
        flex: 1,
    },
    badge: {
        paddingHorizontal: spacing.sm || 8,
        paddingVertical: 4,
        borderRadius: radius.sm || 6,
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 110,
    },
    badgeActive: {
        backgroundColor: "#E6F4EA",
    },
    badgeClosing: {
        backgroundColor: "#FCE8E6",
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    badgeTextActive: {
        color: "#137333",
    },
    badgeTextClosing: {
        color: "#C5221F",
    },
    /* Menu Stack Styles */
    menuContainer: {
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        width: "100%",
    },
    bulletRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3, // Clean distribution spacing between lines
    },
    bulletDot: {
        fontSize: 16,
        color: colors.primary,
        marginRight: 8,
        width: 10,
        textAlign: "center",
    },
    menuText: {
        ...typography.body,
        color: colors.text,
        fontWeight: "500",
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.md,
        width: "100%",
    },
    qrButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: 10,
        borderRadius: radius.lg,
        minHeight: 44,
    },
    qrText: {
        color: "white",
        ...typography.button,
        marginLeft: 8,
        fontWeight: "600",
    },
    menuButton: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 44,
    },
    menuButtonText: {
        ...typography.body,
        color: colors.primary,
        marginRight: 4,
        fontWeight: "600",
    },
});