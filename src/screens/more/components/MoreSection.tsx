import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    ChevronRight,
    LucideIcon,
    Map,
    Users,
    UserRound,
    Settings,
    Info,
    Shield,
    Bug,
    BadgeInfo,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

type Item = {
    title: string;
    icon: LucideIcon;
};

type Section = {
    title: string;
    items: Item[];
};

const sections: Section[] = [
    {
        title: "Campus",
        items: [
            {
                title: "Campus Map",
                icon: Map,
            },
            {
                title: "Representatives",
                icon: Users,
            },
        ],
    },

    {
        title: "Account",
        items: [
            {
                title: "Profile",
                icon: UserRound,
            },
            {
                title: "Settings",
                icon: Settings,
            },
        ],
    },

    {
        title: "About",
        items: [
            {
                title: "About INSIIT",
                icon: Info,
            },
            {
                title: "Team INSIIT",
                icon: Users,
            },
            {
                title: "Privacy Policy",
                icon: Shield,
            },
            {
                title: "Report Bug",
                icon: Bug,
            },
            {
                title: "Version",
                icon: BadgeInfo,
            },
        ],
    },
];

const MoreSection = () => {
    return (
        <>
            {sections.map((section) => (
                <View
                    key={section.title}
                    style={styles.section}
                >
                    <Text style={styles.heading}>
                        {section.title}
                    </Text>

                    <View style={styles.card}>
                        {section.items.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <TouchableOpacity
                                    key={item.title}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.row,
                                        index !== section.items.length - 1 &&
                                        styles.divider,
                                    ]}
                                >
                                    <View style={styles.left}>
                                        <View style={styles.iconContainer}>
                                            <Icon
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </View>

                                        <Text style={styles.title}>
                                            {item.title}
                                        </Text>
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
            ))}
        </>
    );
};

export default MoreSection;

const styles = StyleSheet.create({
    section: {
        marginBottom: spacing.sm,
    },

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
        height: 68,

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
    },

    iconContainer: {
        width: 42,
        height: 42,

        borderRadius: 21,

        backgroundColor: "#EEF4FF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.md,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
});