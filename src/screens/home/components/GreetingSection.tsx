import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Settings2 } from "lucide-react-native";
import { colors, radius, shadows, spacing, typography } from "@/theme";

const GreetingSection = () => {
    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";

    const userName = "Janil";

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
                    color="#1E293B"
                    strokeWidth={2}
                />
            </TouchableOpacity>

            
        </View>
    );
};

export default GreetingSection;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    settingsButton: {
        marginTop: 30,
        width: 48,
        height: 48,
        borderRadius: radius.round,
        backgroundColor: colors.surface,
        justifyContent: "center",
        alignItems: "center",
        ...shadows.card,
    },
    textContainer: {
        alignItems: "flex-end",
    },
    greeting: {
        marginTop: 30,
        ...typography.h3,
        color: colors.textSecondary,
    },
    name: {
        marginTop: 2,
        ...typography.h1,
        color: colors.text,
    },
});