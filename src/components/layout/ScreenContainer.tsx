import React, { PropsWithChildren } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { Screen } from "../ui";
import { useTheme } from "../../theme";

export function ScreenContainer({ children }: PropsWithChildren) {
    const { spacing } = useTheme();

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    {
                        padding: spacing.md,
                    },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
    },
});