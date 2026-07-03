import { useTheme } from "@/theme/useTheme";
import React, { PropsWithChildren } from "react";
import {
    SafeAreaView,
    StyleSheet,
} from "react-native";


export function Screen({
    children,
}: PropsWithChildren) {
    const { colors } = useTheme();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});