import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                <Text style={styles.logo}>INSIIT</Text>

                <Text style={styles.title}>
                    Welcome to INSIIT
                </Text>

                <Text style={styles.subtitle}>
                    Connecting IIT Gandhinagar
                </Text>

                <TouchableOpacity activeOpacity={0.85} style={styles.button}
                    onPress={() => navigation.replace("Home")}>
                    <Text style={styles.buttonText}>
                        Login with IITGN ID
                    </Text>
                </TouchableOpacity>

                <Text style={styles.description}>
                    Access your campus facilities, services
                    {"\n"}
                    & community
                </Text>

                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.replace("Home")}>
                    <Text style={styles.guest}>
                        Login as Guest
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FCFF",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    logo: {
        fontSize: 52,
        fontWeight: "800",
        color: "#1695D2",
        letterSpacing: 1,
        marginBottom: 35,
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#111",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 17,
        color: "#555",
        marginBottom: 50,
    },

    button: {
        width: "100%",
        backgroundColor: "#1695D2",
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: "center",

        shadowColor: "#1695D2",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 6,
    },

    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },

    description: {
        marginTop: 18,
        textAlign: "center",
        color: "#666",
        fontSize: 15,
        lineHeight: 22,
    },

    guest: {
        marginTop: 45,
        fontSize: 19,
        color: "#148CC8",
        fontWeight: "600",
    },

});