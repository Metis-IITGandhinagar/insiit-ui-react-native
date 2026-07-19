// src/navigation/MainPager.tsx
import React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    Extrapolation,
    clamp,
    SharedValue,
} from "react-native-reanimated";
import { TABS, TAB_COUNT } from "./tabs";
import { useSwipeAnimation } from "./SwipeContext";

const SPRING_CONFIG = {
    damping: 22,
    stiffness: 210,
    mass: 0.9,
};

const FLING_VELOCITY_THRESHOLD = 400;

interface TabPaneProps {
    index: number;
    width: number;
    progress: SharedValue<number>;
    children: React.ReactNode;
}

const TabPane = ({ index, width, progress, children }: TabPaneProps) => {
    const style = useAnimatedStyle(() => {
        const distance = progress.value - index;
        const opacity = interpolate(distance, [-1, 0, 1], [0.85, 1, 0.85], Extrapolation.CLAMP);
        const scale = interpolate(distance, [-1, 0, 1], [0.96, 1, 0.96], Extrapolation.CLAMP);
        return {
            opacity,
            transform: [{ scale }],
        };
    });

    return <Animated.View style={[{ width }, style]}>{children}</Animated.View>;
};

const MainPager = () => {
    const { width } = useWindowDimensions();
    const { progress, activeIndex } = useSwipeAnimation();

    const startProgress = useSharedValue(0);

    const pan = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-15, 15])
        .onStart(() => {
            "worklet";
            startProgress.value = progress.value;
        })
        .onUpdate((e) => {
            "worklet";
            const next = startProgress.value - e.translationX / width;
            progress.value = clamp(next, 0, TAB_COUNT - 1);
        })
        .onEnd((e) => {
            "worklet";
            const current = progress.value;
            let target = Math.round(current);

            if (Math.abs(e.velocityX) > FLING_VELOCITY_THRESHOLD) {
                target = e.velocityX < 0 ? Math.ceil(current) : Math.floor(current);
            }

            target = clamp(target, 0, TAB_COUNT - 1);

            progress.value = withSpring(target, SPRING_CONFIG);
            activeIndex.value = target;
        });

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -progress.value * width }],
    }));

    return (
        <GestureDetector gesture={pan}>
            <View style={styles.viewport}>
                <Animated.View
                    style={[
                        styles.row,
                        { width: width * TAB_COUNT },
                        containerStyle,
                    ]}
                >
                    {TABS.map((tab, index) => {
                        const Screen = tab.component;
                        return (
                            <TabPane key={tab.name} index={index} width={width} progress={progress}>
                                <Screen />
                            </TabPane>
                        );
                    })}
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

export default MainPager;

const styles = StyleSheet.create({
    viewport: {
        flex: 1,
        overflow: "hidden",
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
});