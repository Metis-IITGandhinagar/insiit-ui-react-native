import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: Props) => {
    return (
        <View style={styles.container}>
            <Ionicons
                name="search"
                size={20}
                color="#9CA3AF"
                style={styles.icon}
            />

            <TextInput
                style={styles.input}
                placeholder="Search events..."
                placeholderTextColor="#9CA3AF"
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
                        color="#9CA3AF"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        height: 56,

        paddingHorizontal: 16,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 3,
    },

    icon: {
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
});