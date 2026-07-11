import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
   useTheme
} from "@/theme";

const ToolsHeader = () => {
        const theme = useTheme();
        const styles = getStyles(theme);
    return (
        <View style={styles.container}>
                <View>
                    <Text style={styles.title}>
                        Tools
                    </Text>

                    <Text style={styles.subtitle}>
                        Campus services & utilities
                    </Text>
                </View>
            </View>
    );
};

export default ToolsHeader;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
    container: {
        paddingTop: spacing.lg,
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.text,
        textAlign:"center",
    },

    subtitle: {
        marginTop: 4,
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: "500",
        textAlign: "center",
    },

});