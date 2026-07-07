import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ChevronRight,
    Users,
    LucideIcon,
} from "lucide-react-native";

import { colors, radius, spacing } from "@/theme";

type Tool = {
    title: string;
    description: string;
    icon: LucideIcon;
};

const tools: Tool[] = [
    {
        title: "Academic Officials",
        description: "Faculty & administration contacts",
        icon: Users,
    },
];

const ToolSection = () => {
    return (
        <View>
            <Text style={styles.heading}>
                Institute Services
            </Text>

            <View style={styles.card}>
                {tools.map((tool, index) => {
                    const Icon = tool.icon;

                    return (
                        <TouchableOpacity
                            key={tool.title}
                            activeOpacity={0.8}
                            style={[
                                styles.row,
                                index !== tools.length - 1 && styles.divider,
                            ]}
                        >
                            <View style={styles.left}>
                                <View style={styles.iconContainer}>
                                    <Icon
                                        size={20}
                                        color={colors.primary}
                                    />
                                </View>

                                <View>
                                    <Text style={styles.title}>
                                        {tool.title}
                                    </Text>

                                    <Text style={styles.subtitle}>
                                        {tool.description}
                                    </Text>
                                </View>
                            </View>

                            <ChevronRight
                                size={20}
                                color="#94A3B8"
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default ToolSection;

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: spacing.md,
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 4,
    },

    row: {
        height: 78,

        paddingHorizontal: spacing.lg,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E7EB",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,

        backgroundColor: "#EEF4FF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.md,
    },

    title: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        marginTop: 3,
        fontSize: 13,
        color: colors.textSecondary,
    },
});