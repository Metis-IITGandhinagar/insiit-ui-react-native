import React from "react";
import {
    ScrollView,
    ScrollViewProps,
    StatusBar,
    StyleSheet,
    View,
    ViewStyle,
    StyleProp,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

interface ScreenProps {
    children: React.ReactNode;
    /**
     * When true (default) content is wrapped in a padded ScrollView.
     * Set false for screens that own their own scroller (e.g. FlatList).
     */
    scroll?: boolean;
    /** Extra style for the ScrollView's contentContainer (scroll mode). */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /** Passed straight to the ScrollView (e.g. a RefreshControl). */
    refreshControl?: ScrollViewProps["refreshControl"];
    /** Safe-area edges. Defaults to top/left/right (tab bar covers the bottom). */
    edges?: Edge[];
    /** Style for the outer SafeAreaView. */
    style?: StyleProp<ViewStyle>;
    /** Rendered as a sibling of the scroller (e.g. absolute overlays / toasts). */
    overlay?: React.ReactNode;
}

/**
 * Standard screen wrapper: one safe-area implementation, one status-bar
 * treatment, and one set of horizontal / top / bottom paddings for the whole
 * app. Use this instead of hand-rolling SafeAreaView + ScrollView per screen.
 */
const Screen = ({
    children,
    scroll = true,
    contentContainerStyle,
    refreshControl,
    edges = ["top", "left", "right"],
    style,
    overlay,
}: ScreenProps) => {
    const theme = useTheme();
    const { colors, isDark } = theme;
    const styles = getStyles(theme);

    return (
        <SafeAreaView style={[styles.container, style]} edges={edges}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            {scroll ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.content, contentContainerStyle]}
                    refreshControl={refreshControl}
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={styles.flex}>{children}</View>
            )}

            {overlay}
        </SafeAreaView>
    );
};

export default Screen;

const getStyles = ({ colors, layout }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        flex: {
            flex: 1,
        },
        content: {
            paddingHorizontal: layout.screenPaddingX,
            paddingTop: layout.screenPaddingTop,
            paddingBottom: layout.screenPaddingBottom,
            gap: layout.contentGap,
        },
    });
