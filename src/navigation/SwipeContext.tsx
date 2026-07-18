// src/navigation/SwipeContext.tsx
import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from "react";
import {
    useSharedValue,
    withSpring,
    runOnJS,
    SharedValue,
} from "react-native-reanimated";
import { TAB_NAMES, TAB_COUNT, tabIndex, TabName } from "./tabs";


interface SwipeContextValue {
    progress: SharedValue<number>;
    activeIndex: SharedValue<number>;
    goToIndex: (index: number, options?: { animated?: boolean }) => void;
    goToTab: (name: TabName, options?: { animated?: boolean }) => void;
    subscribeActiveIndex: (cb: (index: number) => void) => () => void;
}

const SwipeContext = createContext<SwipeContextValue | null>(null);

const SPRING_CONFIG = {
    damping: 22,
    stiffness: 210,
    mass: 0.9,
};

export const useIsTabActive = (name: TabName): boolean => {
    const { subscribeActiveIndex } = useSwipeContext();
    const [isActive, setIsActive] = useState(() => tabIndex(name) === 0);

    useEffect(() => {
        return subscribeActiveIndex((activeIdx) => {
            setIsActive(activeIdx === tabIndex(name));
        });
    }, [name]);

    return isActive;
};


export const useOnTabBlur = (name: TabName, onBlur: () => void) => {
    const { subscribeActiveIndex } = useSwipeContext();
    const wasActiveRef = useRef(tabIndex(name) === 0);
    const onBlurRef = useRef(onBlur);
    onBlurRef.current = onBlur;

    useEffect(() => {
        return subscribeActiveIndex((activeIdx) => {
            const isActiveNow = activeIdx === tabIndex(name);
            if (wasActiveRef.current && !isActiveNow) {
                onBlurRef.current();
            }
            wasActiveRef.current = isActiveNow;
        });
    }, [name]);
};

export const SwipeProvider = ({ children }: { children: React.ReactNode }) => {
    const progress = useSharedValue(0);
    const activeIndex = useSharedValue(0);

    const listenersRef = useRef<Set<(index: number) => void>>(new Set());

    const notifyListeners = (index: number) => {
        listenersRef.current.forEach((cb) => cb(index));
    };

    const subscribeActiveIndex = (cb: (index: number) => void) => {
        listenersRef.current.add(cb);
        return () => listenersRef.current.delete(cb);
    };

    const goToIndex = (index: number, options?: { animated?: boolean }) => {
        const clamped = Math.max(0, Math.min(TAB_COUNT - 1, index));
        activeIndex.value = clamped;

        if (options?.animated === false) {
            progress.value = clamped;
        } else {
            progress.value = withSpring(clamped, SPRING_CONFIG);
        }

        runOnJS(notifyListeners)(clamped);
    };

    const goToTab = (name: TabName, options?: { animated?: boolean }) => {
        goToIndex(tabIndex(name), options);
    };

    const value = useMemo<SwipeContextValue>(
        () => ({
            progress,
            activeIndex,
            goToIndex,
            goToTab,
            subscribeActiveIndex,
        }),
        []
    );

    return <SwipeContext.Provider value={value}>{children}</SwipeContext.Provider>;
};

const useSwipeContext = (): SwipeContextValue => {
    const ctx = useContext(SwipeContext);
    if (!ctx) {
        throw new Error("useSwipeContext must be used within a SwipeProvider");
    }
    return ctx;
};

export const useTabNavigation = () => {
    const { goToTab, goToIndex } = useSwipeContext();
    return { goToTab, goToIndex, tabNames: TAB_NAMES };
};

export const useSwipeAnimation = () => useSwipeContext();