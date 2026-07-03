import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>INSIIT</Text>
            <Text style={styles.subtitle}>Login Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
    },
});