import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    ChevronRight,
    Soup,
    Megaphone,
    CalendarPlus,
    PencilLine,
    LucideIcon,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

type AdminItem = {
    title: string;
    subtitle: string;
    icon: LucideIcon;
};

type Section = {
    title: string;
    items: AdminItem[];
};

const sections: Section[] = [
    {
        title: "Welfare",
        items: [
            {
                title: "Update Mess Menu",
                subtitle: "Upload monthly mess menu",
                icon: Soup,
            },
            {
                title: "Post Announcement",
                subtitle: "Send announcement to students",
                icon: Megaphone,
            },
        ],
    },

    {
        title: "Events",
        items: [
            {
                title: "Create Event",
                subtitle: "Publish a new event",
                icon: CalendarPlus,
            },
            {
                title: "Edit Events",
                subtitle: "Manage existing events",
                icon: PencilLine,
            },
        ],
    },
];

const AdminSection = () => {
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

                                        <View>
                                            <Text style={styles.title}>
                                                {item.title}
                                            </Text>

                                            <Text style={styles.subtitle}>
                                                {item.subtitle}
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
            ))}
        </>
    );
};

export default AdminSection;

const styles = StyleSheet.create({
    section: {
        marginBottom: spacing.md,
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
        height: 82,

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
        marginTop: 4,
        fontSize: 13,
        color: colors.textSecondary,
    },
});