import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Bell, Megaphone, Search } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/core/theme";
import { useAuth } from "@/core/auth/useAuth";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

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
    const { unreadCount } = useNotifications();

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

            <TouchableOpacity
                style={[styles.settingsButton, styles.buttonSpacing]}
                activeOpacity={0.75}
                onPress={() => navigation.navigate("Notifications")}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
            >
                <Bell size={21} color={colors.primary} strokeWidth={2} />
                {unreadCount > 0 && (
                    <View style={styles.badgeDot} />
                )}
            </TouchableOpacity>

            {!!onRefresh && (
                <TouchableOpacity
                    style={[styles.settingsButton, styles.buttonSpacing]}
                    activeOpacity={0.75}
                    onPress={() => navigation.navigate("Announcements")}
                    accessibilityLabel="Announcements"
                    accessibilityRole="button"
                >
                    <Megaphone size={20} color={colors.primary} strokeWidth={2} />
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.settingsButton}
                activeOpacity={0.75}
                onPress={() => navigation.navigate("GlobalSearch")}
                accessibilityLabel="Search"
                accessibilityRole="button"
            >
                <Search
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
    buttonSpacing: {
        marginRight: spacing.sm,
    },
    badgeDot: {
        position: "absolute",
        top: 11,
        right: 11,
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: colors.danger,
        borderWidth: 1.5,
        borderColor: colors.surface,
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