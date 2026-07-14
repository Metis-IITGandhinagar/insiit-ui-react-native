import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "@/theme";
import type { RootStackParamList } from "@/navigation/types";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    

    const goHome = () => {
    };
    const theme = useTheme();
    const styles = getStyles(theme);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>INSIIT</Text>
                <Text style={styles.title}>Welcome to INSIIT</Text>
                <Text style={styles.subtitle}>Connecting IIT Gandhinagar</Text>

                <TouchableOpacity activeOpacity={0.85} style={styles.button}  onPress={goHome}>
                    <Text style={styles.buttonText}>Login with IITGN ID</Text>
                </TouchableOpacity>

                <Text style={styles.description}>
                    Access your campus facilities, services
                    {"\n"}
                    & community
                </Text>

                <TouchableOpacity activeOpacity={0.7} onPress={goHome}>
                    <Text style={styles.guest}>Login as Guest</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
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