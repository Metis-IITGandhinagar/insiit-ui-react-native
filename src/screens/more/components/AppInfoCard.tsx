import React from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    useTheme
} from "@/core/theme";

const VERSION = "2.0.0";
const BUILD = "24";

const AppInfoCard = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    return (
        <View style={styles.container}>
            <Text style={styles.version}>
                Version {VERSION} ({BUILD})
            </Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                    Linking.openURL("https://insiit.iitgn.ac.in")
                }
            >
                <Text style={styles.team}>
                    Made with ❤️ by Team INSIIT
                </Text>
            </TouchableOpacity>

            <Text style={styles.copyright}>
                © IIT Gandhinagar
            </Text>
        </View>
    );
};

export default AppInfoCard;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: spacing.xl,
        marginBottom: spacing.lg,
    },

    version: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 8,
    },

    team: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
        marginBottom: 8,
    },

    copyright: {
        fontSize: 12,
        color: "#94A3B8",
    },
});