// src/screens/more/MoreScreen.tsx
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/core/theme";
import { useOnTabBlur } from "@/core/navigation/SwipeContext";

import MoreHeader from "./components/MoreHeader";
import MoreSection from "./components/MoreSection";
import AppInfoCard from "./components/AppInfoCard";
import UserCard from "./components/UserCard";

const TOAST_BOTTOM_OFFSET = 150;

interface CustomToast {
    id: string;
    message: string;
    translateY: Animated.Value;
    opacity: Animated.Value;
}

const MoreScreen = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [toasts, setToasts] = useState<CustomToast[]>([]);
    const toastCounter = useRef(0);

    useOnTabBlur('More', useCallback(() => {
        setToasts([]);
    }, []));

    const showToast = useCallback((message: string) => {
        toastCounter.current++;

        const id = `${Date.now()}-${toastCounter.current}`;

        const translateY = new Animated.Value(20);
        const opacity = new Animated.Value(0);

        const toast: CustomToast = { id, message, translateY, opacity };

        setToasts(prev => {
            const updated = [...prev, toast];
            return updated.length > 4 ? updated.slice(updated.length - 4) : updated;
        });

        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                friction: 7,
                tension: 90,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -10,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            });
        }, 3000);
    }, []);

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <MoreHeader />

                    <UserCard />

                    <MoreSection showToast={showToast} />

                    <AppInfoCard />
                </ScrollView>

                <View style={styles.toastContainer} pointerEvents="none">
                    {[...toasts].reverse().map((toast) => (
                        <Animated.View
                            key={toast.id}
                            style={[
                                styles.toastCard,
                                {
                                    opacity: toast.opacity,
                                    transform: [{ translateY: toast.translateY }]
                                }
                            ]}
                        >
                            <Text style={styles.toastText}>{toast.message}</Text>
                        </Animated.View>
                    ))}
                </View>
            </SafeAreaView>
        </>
    );
};

export default MoreScreen;

const getStyles = ({ colors, radius, spacing }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: 120,
            gap: spacing.lg,
        },
        toastContainer: {
            position: "absolute",
            left: 20,
            right: 20,
            bottom: TOAST_BOTTOM_OFFSET,
            zIndex: 9999,
            elevation: 9999,
            alignItems: "center",
            justifyContent: "flex-end",
        },
        toastCard: {
            backgroundColor: '#FEE2E2',
            borderWidth: 1,
            borderColor: '#EF4444',
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.xl,
            width: Dimensions.get('window').width - 40,
            shadowColor: '#EF4444',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
            marginTop: 8,
        },
        toastText: {
            color: '#991B1B',
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        }
    });