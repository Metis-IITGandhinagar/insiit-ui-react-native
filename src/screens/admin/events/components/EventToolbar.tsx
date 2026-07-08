import React from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Plus,
    Search,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const EventToolbar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search
                    size={20}
                    color="#94A3B8"
                />

                <TextInput
                    placeholder="Search events..."
                    placeholderTextColor="#94A3B8"
                    style={styles.input}
                />
            </View>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.button}
            >
                <Plus
                    size={20}
                    color="#FFFFFF"
                />
            </TouchableOpacity>
        </View>
    );
};

export default EventToolbar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },

    searchContainer: {
        flex: 1,
        height: 52,

        backgroundColor: colors.surface,

        borderRadius: radius.lg,

        paddingHorizontal: spacing.md,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    input: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: 15,
        color: colors.text,
    },

    button: {
        width: 52,
        height: 52,

        marginLeft: spacing.md,

        borderRadius: radius.lg,

        backgroundColor: colors.primary,

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#2563EB",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },
});