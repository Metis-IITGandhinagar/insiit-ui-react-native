import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MessageSquareText, GraduationCap, ClipboardList, Building2, LucideIcon } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "@/core/theme";
import { Card } from "@shared/components/Card";
import { openLink } from "@/utils/linking";
import { LINKS } from '@/constants/links';
import MessFeedbackScreen from "../screens/MessFeedbackScreen";



type ActionItem = {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    color: string;
    iconColor: string;
    type: "screen" | "link";
    target: string;
};

const actions: ActionItem[] = [
    {
        title: "Mess",
        subtitle: "Feedback",
        icon: MessageSquareText,
        color: "#DBEAFE",
        iconColor: "#2563EB",
        type: "screen",
        target: "MessFeedback",
    },
    {
        title: "Academic",
        subtitle: "Portal",
        icon: GraduationCap,
        color: "#F3E8FF",
        iconColor: "#7C3AED",
        type: "link",
        target: LINKS.academic, 
    },
    {
        title: "IMS",
        subtitle: "Portal",
        icon: ClipboardList,
        color: "#DCFCE7",
        iconColor: "#16A34A",
        type: "link",
        target: LINKS.ims, 
    },
    {
        title: "Guest",
        subtitle: "House",
        icon: Building2,
        color: "#FEF3C7",
        iconColor: "#D97706",
        type: "link",
        target: LINKS.guest_house,
    },
];

const QuickActions = () => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation<any>();

    const handlePress = (item: ActionItem) => {
        if (item.type === "screen") {
            navigation.navigate(item.target);
        } else if (item.type === "link") {
            openLink(item.target); 
        }
    };
  
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Quick Access</Text>

            <View style={styles.gridContainer}>
                {actions.map((item) => {
                    const Icon = item.icon;

                    return (
                        <View key={item.title} style={styles.gridCol}>
                            <Card variant="surface" style={{ padding: 0 }}>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={styles.cardCell}
                                    onPress={() => handlePress(item)}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                        <Icon size={26} color={item.iconColor} strokeWidth={2} />
                                    </View>
                                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
                                </TouchableOpacity>
                            </Card>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default QuickActions;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    container: {
        width: "100%",
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: spacing.md,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -spacing.sm / 2,
    },
    gridCol: {
        width: "33.33%",
        paddingHorizontal: spacing.sm / 2,
        marginBottom: spacing.md,
    },
    cardCell: {
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: radius.round || 28,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: "center",
    },
});