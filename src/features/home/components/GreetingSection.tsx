import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RefreshCw, Settings2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/core/theme";
import { useAuth } from "@/core/auth/useAuth";

interface Props {
    onRefresh?: () => void;
    refreshing?: boolean;
}

const GreetingSection = ({ onRefresh, refreshing = false }: Props) => {
    const hour = new Date().getHours();
    const theme = useTheme();
    const { colors } = theme;
    const navigation = useNavigation<any>();
    const { user } = useAuth();

    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";

    // First word of the Google display name — "Janil Jain" -> "Janil". Falls back to
    // the greeting alone rather than showing a placeholder name.
    const firstName = user?.displayName?.trim().split(/\s+/)[0] ?? "";

    const styles = getStyles(theme);
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>
                    {firstName ? `${greeting},` : greeting}
                </Text>

                {!!firstName && (
                    <Text style={styles.name} numberOfLines={1}>
                        {firstName} 👋
                    </Text>
                )}
            </View>

            {!!onRefresh && (
                <TouchableOpacity
                    style={[styles.settingsButton, styles.refreshButton]}
                    activeOpacity={0.75}
                    onPress={onRefresh}
                    disabled={refreshing}
                    accessibilityLabel="Refresh"
                    accessibilityRole="button"
                >
                    {refreshing ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <RefreshCw size={20} color={colors.primary} strokeWidth={2} />
                    )}
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.settingsButton}
                activeOpacity={0.75}
                onPress={() => navigation.navigate("Settings")}
            >
                <Settings2
                    size={22}
                    color={colors.primary}
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
    refreshButton: {
        marginRight: spacing.sm,
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
        flex: 1,
        alignItems: "flex-start",
    },
    greeting: {
        marginRight:10,
        ...typography.h1,
        color: colors.text,
    },
    name: {
        marginTop: 2,
        ...typography.h1,
        color: colors.text,
    },
});