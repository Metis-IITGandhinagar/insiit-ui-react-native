// src/screens/auth/LoginScreen.tsx

import React, { useState } from "react";
import {
    Alert,
    ActivityIndicator,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/core/theme";
import { useAuth } from "@core/auth/useAuth";

const LoginScreen = () => {
    const { signIn, continueAsGuest } = useAuth();
    const { colors } = useTheme();

    const styles = getStyles(useTheme());

    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        if (loading) return;

        setLoading(true);

        try {
            await signIn();
        } catch (error: any) {
            if (!error?.message?.includes("cancel")) {
                Alert.alert(
                    "Authentication Failed",
                    error?.message ?? "Unable to sign in."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        Alert.alert(
            "Continue as guest",
            "You can browse the mess menu, bus timings, events, outlets and lost & found. Posting, bidding and your profile need an IITGN account — you can sign in any time.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Continue",
                    onPress: async () => {
                        try {
                            await continueAsGuest();
                        } catch {
                            Alert.alert(
                                "Couldn't continue as guest",
                                "Check your connection and try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <View style={styles.content}>

                    <View style={styles.hero}>

                        {/* <Image
                            source={require("@/assets/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        /> */}

                        <Text style={styles.logoText}>
                            INSIIT
                        </Text>

                        <Text style={styles.title}>
                            Welcome to INSIIT
                        </Text>

                        <Text style={styles.subtitle}>
                            Your digital companion for life at{"\n"}
                            IIT Gandhinagar
                        </Text>

                    </View>

                    <View style={styles.actions}>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            disabled={loading}
                            onPress={handleGoogleLogin}
                            style={[
                                styles.primaryButton,
                                loading && styles.buttonDisabled,
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    color="white"
                                />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Continue with IITGN ID
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={loading}
                            onPress={handleGuestLogin}
                            style={styles.secondaryButton}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Continue as Guest
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            By continuing, you agree to the IITGN usage
                            policies.
                        </Text>

                        <Text style={styles.version}>
                            INSIIT • Version 1.0
                        </Text>
                    </View>

                </View>
            </SafeAreaView>
        </>
    );
};

export default LoginScreen;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        content: {
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: spacing.xl,
            paddingTop: 48,
            paddingBottom: 24,
        },

        hero: {
            alignItems: "center",
            marginTop: 16,
        },

        logo: {
            width: 88,
            height: 88,
            marginBottom: 28,
        },

        logoText: {
            fontSize: 48,
            fontWeight: "800",
            color: colors.text,
            letterSpacing: 1,
            marginBottom: 28,
        },

        title: {
            ...typography.h1,
            color: colors.text,
            textAlign: "center",
            marginBottom: 10,
        },

        subtitle: {
            ...typography.body,
            color: colors.textSecondary,
            textAlign: "center",
            lineHeight: 24,
            paddingHorizontal: 20,
        },

        actions: {
            width: "100%",
            gap: 16,
            marginTop: 48,
        },

        primaryButton: {
            height: 58,
            borderRadius: 18,
            backgroundColor: colors.primary,

            justifyContent: "center",
            alignItems: "center",

            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 14,
            shadowOffset: {
                width: 0,
                height: 8,
            },

            elevation: 8,
        },

        buttonDisabled: {
            opacity: 0.7,
        },

        primaryButtonText: {
            color: "#FFFFFF",
            ...typography.button,
            fontWeight: "700",
            letterSpacing: 0.2,
        },

        secondaryButton: {
            height: 54,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
            backgroundColor: colors.primaryLight,
            borderWidth: 1,
            borderColor: colors.border,
        },

        secondaryButtonText: {
            ...typography.button,
            color: colors.primary,
            fontWeight: "600",
        },

        footer: {
            alignItems: "center",
            paddingTop: 32,
        },

        footerText: {
            ...typography.caption,
            color: colors.textSecondary,
            textAlign: "center",
            lineHeight: 20,
            paddingHorizontal: 18,
        },

        version: {
            marginTop: 16,
            fontSize: 12,
            fontWeight: "600",
            color: colors.textSecondary,
            opacity: 0.7,
            letterSpacing: 0.5,
        },
    });