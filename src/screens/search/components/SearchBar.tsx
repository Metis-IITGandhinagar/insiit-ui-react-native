import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";

interface Props {
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: Props) => {
        const theme = useTheme();
        const { colors } = theme;
        const styles = getStyles(theme);
    return (
        <View style={styles.container}>
            <Ionicons
                name="search"
                size={20}
                color={colors.inactive}
                style={styles.icon}
            />

            <TextInput
                style={styles.input}
                placeholder="Search events..."
                placeholderTextColor={colors.inactive}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                returnKeyType="search"
            />

            {value.length > 0 && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onChangeText("")}
                >
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.inactive}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchBar;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        height: 56,
        paddingHorizontal: spacing.md,
        ...shadows.card,
    },

    icon: {
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
});