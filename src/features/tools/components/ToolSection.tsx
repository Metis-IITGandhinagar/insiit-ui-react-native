import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Users, DoorOpen, LucideIcon } from "lucide-react-native";

import { useTheme } from "@/core/theme";
import { Card } from "@shared/components/Card";
import { ListItem } from "@shared/components/ListItem";
import { openLink } from "@/utils/linking";
import { LINKS } from "@/constants/links";

type Tool = {
    title: string;
    description: string;
    icon: LucideIcon;
    link: string;
};

const tools: Tool[] = [
    {
        title: "Room Booking",
        description: "Book your room from 8 AM - 8 PM",
        icon: DoorOpen, // Updated to a distinct icon
        link: LINKS.room_booking,
    },
    {
        title: "Academic Officials",
        description: "Faculty & administration contacts",
        icon: Users,
        link: LINKS.academic_officials,
    },
];

const ToolSection = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.heading}>
                Institute Services
            </Text>

            <Card variant="surface" style={{ padding: 0 }}>
                {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    // Only show the divider if it's NOT the last item in the list
                    const isLastItem = index === tools.length - 1;

                    return (
                        <View key={tool.title} style={styles.rowWrapper}>
                            <ListItem
                                leadingIcon={
                                    <View style={styles.iconContainer}>
                                        <Icon
                                            size={20}
                                            color={colors.primary}
                                        />
                                    </View>
                                }
                                title={tool.title}
                                subtitle={tool.description}
                                onPress={() => openLink(tool.link)}
                                showDivider={!isLastItem} // Adds the missing line
                            />
                        </View>
                    );
                })}
            </Card>
        </View>
    );
};

export default ToolSection;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    sectionContainer: {
        width: "100%",
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: spacing.md,
    },
    rowWrapper: {
        height: 78,
        justifyContent: "center",
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: radius.round || 23,
        backgroundColor: colors.primaryLight || "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
    },
});