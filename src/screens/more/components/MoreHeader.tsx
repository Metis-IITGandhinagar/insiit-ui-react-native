import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
   useTheme
} from "@/theme";

const MoreHeader = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    return (
        <View style={styles.container}>
                <View>
                    <Text style={styles.title}>
                        More
                    </Text>

                    <Text style={styles.subtitle}>
                        Account, campus & app settings
                    </Text>
                </View>
            </View>
    );
};

export default MoreHeader;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
    container: {
        paddingTop:spacing.lg,
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
        fontWeight: "500",
        color: colors.textSecondary,
        textAlign: "center",
    },
});