// src/screens/home/components/FloatingNavbar.tsx
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue,
} from "react-native-reanimated";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/core/theme";
import { TABS, TAB_COUNT } from "@/core/navigation/tabs";
import { useSwipeAnimation } from "@/core/navigation/SwipeContext";

interface NavItemProps {
    index: number;
    Icon: LucideIcon;
    progress: SharedValue<number>;
    activeColor: string;
    inactiveColor: string;
    onPress: () => void;
    style: any;
    iconContainerStyle: any;
}

const NavItem = ({
    index,
    Icon,
    progress,
    activeColor,
    inactiveColor,
    onPress,
    style,
    iconContainerStyle,
}: NavItemProps) => {
    const inactiveIconStyle = useAnimatedStyle(() => {
        const t = interpolate(progress.value, [index - 1, index, index + 1], [0, 1, 0], Extrapolation.CLAMP);
        return { opacity: 1 - t };
    });

    const activeIconStyle = useAnimatedStyle(() => {
        const t = interpolate(progress.value, [index - 1, index, index + 1], [0, 1, 0], Extrapolation.CLAMP);
        return { opacity: t };
    });

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
            <View style={iconContainerStyle}>
                <Animated.View style={inactiveIconStyle}>
                    <Icon size={24} color={inactiveColor} strokeWidth={2.2} />
                </Animated.View>
                <Animated.View style={[StyleSheet.absoluteFill, activeIconStyle]}>
                    <Icon size={24} color={activeColor} strokeWidth={2.2} />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

const FloatingNavbar = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const { progress, activeIndex, goToIndex } = useSwipeAnimation();

    const [containerWidth, setContainerWidth] = useState(0);
    const itemWidth = containerWidth / TAB_COUNT;

    const pillStyle = useAnimatedStyle(() => {
        if (containerWidth === 0) return {};

        const translateX = progress.value * itemWidth;

        const distanceFromSettled = Math.abs(progress.value - Math.round(progress.value));
        const scaleX = interpolate(distanceFromSettled, [0, 0.5], [1, 0.82], Extrapolation.CLAMP);

        return {
            transform: [{ translateX }, { scaleX }],
        };
    });

    return (
        <View style={styles.wrapper}>
            <View
                style={styles.container}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
                {containerWidth > 0 ? (
                    <Animated.View style={[styles.activePillContainer, { width: itemWidth }, pillStyle]}>
                        <View style={styles.activePill} />
                    </Animated.View>
                ) : null}

                {TABS.map((tab, index) => (
                    <NavItem
                        key={tab.name}
                        index={index}
                        Icon={tab.icon}
                        progress={progress}
                        activeColor={colors.surface}
                        inactiveColor={colors.primary}
                        onPress={() => {
                            if (Math.round(activeIndex.value) === index) return;
                            goToIndex(index);
                        }}
                        style={styles.item}
                        iconContainerStyle={styles.iconContainer}
                    />
                ))}
            </View>
        </View>
    );
};

export default FloatingNavbar;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: spacing.lg,
        right: spacing.lg,
        bottom: 60,
    },
    container: {
        height: 72,
        backgroundColor: colors.surface,
        borderRadius: radius.round,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
        position: "relative",
    },
    activePillContainer: {
        position: "absolute",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    activePill: {
        width: 52,
        height: 52,
        borderRadius: radius.round,
        backgroundColor: colors.primary,
    },
    item: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    iconContainer: {
        width: 24,
        height: 24,
        position: "relative",
    },
});