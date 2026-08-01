import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Settings2 } from "lucide-react-native";
import { useTheme } from "@/theme";

const GreetingSection = () => {
    const hour = new Date().getHours();
    const theme = useTheme();
    const { colors } = theme;

    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";

    const userName = "Janil";
    const styles = getStyles(theme);
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>
                    {greeting},
                </Text>

                <Text style={styles.name}>
                    {userName} 👋
                </Text>
            </View>
            
            <TouchableOpacity
                style={styles.settingsButton}
                activeOpacity={0.75}
            >
                <Settings2
                    size={22}
                    color={colors.textStrong}
                    strokeWidth={2}
                />
            </TouchableOpacity>
        </View>
    );
};

export default GreetingSection;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    settingsButton: {
        width: 48,
        height: 48,
        borderRadius: radius.round,
        backgroundColor: colors.surface,
        justifyContent: "center",
        alignItems: "center",
        ...shadows.card,
    },
    textContainer: {
        alignItems: "flex-start",
    },
    greeting: {
        ...typography.h3,
        color: colors.textSecondary,
    },
    name: {
        marginTop: 2,
        ...typography.h1,
        color: colors.text,
    },
});