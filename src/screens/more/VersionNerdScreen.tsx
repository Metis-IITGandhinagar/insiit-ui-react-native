import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/core/navigation/types";
import { useTheme } from "@/core/theme";
import { ShieldAlert, Award, Smile } from "lucide-react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "VersionNerd">;

type Stage = "haha_nerd" | "still_a_nerd" | "final_version";

const VersionNerdScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [stage, setStage] = useState<Stage>("haha_nerd");

    const goBackToSettings = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <View style={styles.contentWrapper}>

                {/* Stage 1: The Initial Callout */}
                {stage === "haha_nerd" && (
                    <View style={styles.card}>
                        <ShieldAlert size={48} color={colors.primary} style={styles.icon} />
                        <Text style={styles.jokeText}>🚨 Haha, nerd detected!</Text>
                        <Text style={styles.subText}>Who actually clicks on the version number info field? Honestly.</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={goBackToSettings}>
                                <Text style={[styles.btnText, { color: colors.text }]}>Escape safely</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setStage("still_a_nerd")}>
                                <Text style={[styles.btnText, styles.btnPrimaryText]}>Go Ahead</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Stage 2: The Double Down */}
                {stage === "still_a_nerd" && (
                    <View style={styles.card}>
                        <Smile size={48} color="#D97706" style={styles.icon} />
                        <Text style={styles.jokeText}>🤓 ...Still a nerd.</Text>
                        <Text style={styles.subText}>You really pressed "Go Ahead"? Respect the commitment to curiosity, but you're digging deeper.</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={goBackToSettings}>
                                <Text style={[styles.btnText, { color: colors.text }]}>Accept defeat & leave</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: "#D97706" }]} onPress={() => setStage("final_version")}>
                                <Text style={[styles.btnText, styles.btnPrimaryText]}>Give it to me</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Stage 3: The Payoff */}
                {stage === "final_version" && (
                    <View style={styles.card}>
                        <Award size={48} color="#059669" style={styles.icon} />
                        <Text style={[styles.jokeText, { color: "#059669" }]}>🏆 Fine, here you go!</Text>
                        <Text style={styles.versionDisplay}>INSIIT Production Engine</Text>
                        <Text style={styles.versionNumber}>Build Version 1.0.4 (Release 26)</Text>
                        <Text style={[styles.subText, { marginTop: 8 }]}>Proudly compiled by the Metis Club, IITGN </Text>

                        <TouchableOpacity style={[styles.btn, styles.btnPrimary, { width: "100%", marginTop: 8 }]} onPress={goBackToSettings}>
                            <Text style={[styles.btnText, styles.btnPrimaryText]}>Back to safety</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

export default VersionNerdScreen;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    contentWrapper: {
        width: "100%",
        paddingHorizontal: spacing.xl,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.xl,
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
    },
    icon: {
        marginBottom: spacing.md,
    },
    jokeText: {
        fontSize: 24,
        fontWeight: "900",
        color: colors.text,
        textAlign: "center",
        marginBottom: spacing.sm,
    },
    subText: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.xs,
    },
    versionDisplay: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginTop: spacing.sm,
    },
    versionNumber: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.primary,
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    btn: {
        flex: 1,
        height: 48,
        borderRadius: radius.lg,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 4,
    },
    btnPrimary: {
        backgroundColor: colors.primary,
    },
    btnSecondary: {
        backgroundColor: "#F1F5F9",
    },
    btnText: {
        fontSize: 14,
        fontWeight: "700",
    },
    btnPrimaryText: {
        color: "#FFFFFF",
    },
});