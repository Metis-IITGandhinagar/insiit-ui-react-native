import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    MessageSquareText,
    GraduationCap,
    ClipboardList,
    Building2,
    ArrowRight,
} from "lucide-react-native";

import {
    useTheme
} from "@/theme";

const actions = [
    {
        title: "Mess",
        subtitle: "Feedback",
        icon: MessageSquareText,
        color: "#DBEAFE",
        iconColor: "#2563EB",
    },
    {
        title: "Academic",
        subtitle: "Portal",
        icon: GraduationCap,
        color: "#F3E8FF",
        iconColor: "#7C3AED",
    },
    {
        title: "IMS",
        subtitle: "Portal",
        icon: ClipboardList,
        color: "#DCFCE7",
        iconColor: "#16A34A",
    },
    {
        title: "Guest",
        subtitle: "House",
        icon: Building2,
        color: "#FEF3C7",
        iconColor: "#D97706",
    },
];

const QuickActions = () => {
        const theme = useTheme();
        const styles = getStyles(theme);
    return (
        <View>
            <Text style={styles.heading}>
                Quick Access
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {actions.map((item) => {
                    const Icon = item.icon;

                    return (
                        <TouchableOpacity
                            key={item.title}
                            activeOpacity={0.85}
                            style={styles.card}
                        >
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: item.color },
                                ]}
                            >
                                <Icon
                                    size={26}
                                    color={item.iconColor}
                                    strokeWidth={2}
                                />
                                
                            </View>
                            
                            <Text style={styles.title}>
                                {item.title}
                            </Text>

                            <Text style={styles.subtitle}>
                                {item.subtitle}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default QuickActions;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: spacing.md,
    },

    list: {
        paddingRight: spacing.lg,
        paddingBottom:spacing.md,
    },

    card: {
        width: 110,

        backgroundColor: colors.surface,

        borderRadius: radius.xl,

        paddingVertical: 18,

        alignItems: "center",

        marginRight: spacing.md,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 4,
    },

    iconContainer: {
        width: 56,
        height: 56,

        borderRadius: 28,

        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: colors.textSecondary,
    },
});