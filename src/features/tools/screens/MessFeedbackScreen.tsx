import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Utensils } from "lucide-react-native";

import { useTheme } from "@/core/theme";
import { Card } from "@shared/components/Card";
import { ListItem } from "@shared/components/ListItem";
import { openLink } from "@/utils/linking";
import { LINKS } from "@/constants/links";

const messItems = [
    {
        name: "Bhopal Mess",
        link: LINKS.bhopal_mess,
    },
    {
        name: "Jaiswal Mess",
        link: LINKS.jaiswal_mess,
    },
    {
        name: "Mohani Mess",
        link: LINKS.mohani_mess,
    },
    {
        name: "Rgouras Mess",
        link: LINKS.rgouras_mess,
    },
];

const MessFeedbackScreen = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Mess Feedback</Text>
                <Text style={styles.subtitle}>
                    Select your dining hall to open the institutional feedback forms
                </Text>
            </View>

            <View style={styles.content}>
                <Card variant="surface" style={{ padding: 0 }}>
                    {messItems.map((mess, index) => (
                        <View key={mess.name} style={styles.rowWrapper}>
                            <ListItem
                                leadingIcon={
                                    <View style={styles.iconContainer}>
                                        <Utensils size={20} color={colors.primary} />
                                    </View>
                                }
                                title={mess.name}
                                onPress={() => openLink(mess.link)}
                                showDivider={index !== messItems.length - 1}
                            />
                        </View>
                    ))}
                </Card>
            </View>
        </SafeAreaView>
    );
};

export default MessFeedbackScreen;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
        paddingTop:20,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: spacing.xs,
        lineHeight: 20,
        paddingHorizontal: spacing.md,
    },
    content: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
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