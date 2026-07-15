import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Linking,
    StatusBar,
    Image,
    BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Code2, Mail } from "lucide-react-native";
import { useTheme } from "@/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TeamINSIIT">;

interface TeamMember {
    id: "memberA" | "memberB";
    name: string;
    avatarUrl: any;
    role: string;
    quote: string;
    github: string;
    email: string;
}

const teamData: { memberA: TeamMember; memberB: TeamMember } = {
    memberA: {
        id: "memberA",
        name: "Janil Jain",
        avatarUrl: require("@assets/team/advait.png"),
        role: "UI/UX Product Designer ",
        quote: "The app looked good so I made it better",
        github: "https://github.com/Janil-ship-it",
        email: "mailto:janil.jain@iitgn.ac.in"
    },
    memberB: {
        id: "memberB",
        name: "Advait Andhale",
        avatarUrl: require("@assets/team/advait.png"),
        role: "Backend Enginner",
        quote: "Flexing my rust skills",
        github: "https://github.com/advait87",
        email: "mailto:advait.andhale@iitgn.ac.in"
    }
};

const TeamScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [expandedMember, setExpandedMember] = useState<"memberA" | "memberB" | null>(null);

    const flexAnimA = useRef(new Animated.Value(1)).current;
    const flexAnimB = useRef(new Animated.Value(1)).current;

    const detailsOpacity = useRef(new Animated.Value(0)).current;
    const blurOverlayOpacityA = useRef(new Animated.Value(0)).current;
    const blurOverlayOpacityB = useRef(new Animated.Value(0)).current;

    const resetLayout = () => {
        setExpandedMember(null);
        Animated.parallel([
            Animated.spring(flexAnimA, { toValue: 1, useNativeDriver: false, bounciness: 3 }),
            Animated.spring(flexAnimB, { toValue: 1, useNativeDriver: false, bounciness: 3 }),
            Animated.timing(detailsOpacity, { toValue: 0, duration: 150, useNativeDriver: false }),
            Animated.timing(blurOverlayOpacityA, { toValue: 0, duration: 200, useNativeDriver: false }),
            Animated.timing(blurOverlayOpacityB, { toValue: 0, duration: 200, useNativeDriver: false }),
        ]).start();
    };

    useEffect(() => {
        const handleBackPress = () => {
            if (expandedMember !== null) {
                resetLayout();
                return true;
            }
            navigation.navigate("More");
            return true;
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
        return () => subscription.remove();
    }, [expandedMember, navigation]);

    const handlePress = (target: "memberA" | "memberB") => {
        if (expandedMember === target) {
            resetLayout();
        } else {
            setExpandedMember(target);
            detailsOpacity.setValue(0);

            Animated.parallel([
                Animated.spring(flexAnimA, { toValue: target === "memberA" ? 4.5 : 1, useNativeDriver: false, bounciness: 2 }),
                Animated.spring(flexAnimB, { toValue: target === "memberB" ? 4.5 : 1, useNativeDriver: false, bounciness: 2 }),
                Animated.timing(detailsOpacity, { toValue: 1, duration: 250, delay: 150, useNativeDriver: false }),
                Animated.timing(blurOverlayOpacityA, { toValue: target === "memberB" ? 0.75 : 0, duration: 250, useNativeDriver: false }),
                Animated.timing(blurOverlayOpacityB, { toValue: target === "memberA" ? 0.75 : 0, duration: 250, useNativeDriver: false }),
            ]).start();
        }
    };

    const openLink = (url: string) => {
        Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <View style={styles.splitWrapper}>

                {/* Left Panel Area - Member A */}
                <Animated.View style={[styles.panel, { flex: flexAnimA }]}>
                    <TouchableOpacity
                        style={styles.touchArea}
                        activeOpacity={1}
                        onPress={() => handlePress("memberA")}
                    >
                        <Image source={{ uri: teamData.memberA.avatarUrl }} style={styles.backgroundImage} />
                        <Animated.View style={[styles.blurOverlay, { opacity: blurOverlayOpacityA }]} pointerEvents="none" />

                        {expandedMember !== "memberB" && (
                            <View style={[styles.panelContent, expandedMember === "memberA" && styles.contentExpandedPosition]}>
                                <Text style={styles.nameText}>{teamData.memberA.name}</Text>
                                {expandedMember === null && <Text style={styles.tapPrompt}>Tap to enter</Text>}

                                {expandedMember === "memberA" && (
                                    <Animated.View style={{ opacity: detailsOpacity }}>
                                        <Text style={styles.roleText}>{teamData.memberA.role}</Text>
                                        <Text style={styles.quoteText}>"{teamData.memberA.quote}"</Text>
                                        <View style={styles.socialGroup}>
                                            <TouchableOpacity onPress={() => openLink(teamData.memberA.github)} style={styles.iconButton}>
                                                <Code2 size={22} color="#FFFFFF" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => openLink(teamData.memberA.email)} style={styles.iconButton}>
                                                <Mail size={22} color="#FFFFFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                {/* Right Panel Area - Member B */}
                <Animated.View style={[styles.panel, { flex: flexAnimB }]}>
                    <TouchableOpacity
                        style={styles.touchArea}
                        activeOpacity={1}
                        onPress={() => handlePress("memberB")}
                    >
                        <Image source={{ uri: teamData.memberB.avatarUrl }} style={styles.backgroundImage} />
                        <Animated.View style={[styles.blurOverlay, { opacity: blurOverlayOpacityB }]} pointerEvents="none" />

                        {expandedMember !== "memberA" && (
                            <View style={[styles.panelContent, expandedMember === "memberB" && styles.contentExpandedPosition]}>
                                <Text style={styles.nameText}>{teamData.memberB.name}</Text>
                                {expandedMember === null && <Text style={styles.tapPrompt}>Tap to enter</Text>}

                                {expandedMember === "memberB" && (
                                    <Animated.View style={{ opacity: detailsOpacity }}>
                                        <Text style={[styles.roleText, { color: "#FBBF24" }]}>{teamData.memberB.role}</Text>
                                        <Text style={styles.quoteText}>"{teamData.memberB.quote}"</Text>
                                        <View style={styles.socialGroup}>
                                            <TouchableOpacity onPress={() => openLink(teamData.memberB.github)} style={styles.iconButton}>
                                                <Code2 size={22} color="#FFFFFF" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => openLink(teamData.memberB.email)} style={styles.iconButton}>
                                                <Mail size={22} color="#FFFFFF" />
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>

            </View>

        </SafeAreaView>
    );
};

export default TeamScreen;

const getStyles = ({ spacing }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    splitWrapper: {
        flex: 1,
        flexDirection: "row",
    },
    panel: {
        height: "100%",
        overflow: "hidden",
    },
    touchArea: {
        flex: 1,
        height: "100%",
        justifyContent: "flex-end",
    },
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    blurOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000",
    },
    panelContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 60,
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        paddingVertical: spacing.xl,
    },
    contentExpandedPosition: {
        paddingBottom: 80,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
    },
    nameText: {
        fontSize: 26,
        fontWeight: "900",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    tapPrompt: {
        fontSize: 12,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.7)",
        marginTop: 4,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    roleText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#60A5FA",
        marginTop: 6,
        marginBottom: spacing.xs,
    },
    quoteText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#E2E8F0",
        fontStyle: "italic",
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    socialGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.sm,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(255, 255, 255, 0.25)",
    },
    floatingCloseButton: {
        position: "absolute",
        top: 50,
        right: 20,
        zIndex: 99,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
});