import React from "react";
import {
    ActivityIndicator,
    View,
} from "react-native";

import { Screen } from "../ui";
import { useTheme } from "../../theme";

export function LoadingView() {
    const { colors } = useTheme();

    return (
        <Screen>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />
            </View>
        </Screen>
    );
}