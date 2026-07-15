import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../hooks/useAuth';

import { useTheme } from "@/theme";

const LoginScreen = () => {
    const { signIn } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const theme = useTheme();
    const styles = getStyles(theme);

    const handleGoogleLogin = async () => {
        if (isLoggingIn) return;

        setIsLoggingIn(true);
        try {
            await signIn();
        } catch (error: any) {
            if (error.message && !error.message.includes('Sign in cancelled')) {
                Alert.alert("Authentication Error", error.message || "Failed to log in with Google.");
            }
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleGuestLogin = () => {
        Alert.alert("Guest Access", "Guest mode functionality can be customized here later.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>INSIIT</Text>
                <Text style={styles.title}>Welcome to INSIIT</Text>
                <Text style={styles.subtitle}>Connecting IIT Gandhinagar</Text>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.button, isLoggingIn && { opacity: 0.7 }]}
                    onPress={handleGoogleLogin}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <ActivityIndicator color={theme.colors.surface} size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Login with IITGN ID</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.description}>
                    Access your campus facilities, services
                    {"\n"}
                    & community
                </Text>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleGuestLogin}
                    disabled={isLoggingIn}
                >
                    <Text style={styles.guest}>Login as Guest</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
    },
    logo: {
        ...typography.display,
        color: colors.accent,
        letterSpacing: 1,
        marginBottom: spacing.xxl,
    },
    title: {
        ...typography.h1,
        color: colors.textStrong,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xxl,
    },
    button: {
        width: "100%",
        backgroundColor: colors.accent,
        borderRadius: radius.round,
        paddingVertical: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 55, // Prevents layout shifts during loading states
        shadowColor: colors.accent,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 6,
    },
    buttonText: {
        color: colors.surface,
        ...typography.button,
    },
    description: {
        marginTop: spacing.md,
        textAlign: "center",
        color: colors.textSecondary,
        ...typography.caption,
        lineHeight: 22,
    },
    guest: {
        marginTop: spacing.xxl,
        ...typography.body,
        color: colors.accent,
        fontWeight: "600",
    },
});