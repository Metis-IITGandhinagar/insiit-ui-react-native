import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { ArrowLeft, Phone, Mail } from "lucide-react-native";
import { useTheme } from "@/theme";
import { representativeService, Representative } from "@/services/api/representativeService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Representatives">;

const RepresentativesScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [reps, setReps] = useState<Representative[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReps = async () => {
            try {
                const data = await representativeService.getAllRepresentatives();
                setReps(data);
            } catch (error) {
                console.error("Failed fetching student representatives:", error);
                Alert.alert("Error", "Failed to load student representative details.");
            } finally {
                setLoading(false);
            }
        };

        fetchReps();
    }, []);

    const handleCall = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("Not Supported", "Phone calls are not supported on this device.");
                }
            })
            .catch((err) => console.error("Error opening phone app:", err));
    };

    const handleEmail = (emailAddress: string) => {
        const url = `mailto:${emailAddress}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("Not Supported", "Email apps are not available on this device.");
                }
            })
            .catch((err) => console.error("Error opening email app:", err));
    };

    const renderRepItem = ({ item }: { item: Representative }) => (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.designation}>{item.designation}</Text>
                {item.department && <Text style={styles.dept}>{item.department}</Text>}
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.phoneButton]}
                    onPress={() => handleCall(item.phone)}
                    activeOpacity={0.7}
                >
                    <Phone size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.emailButton]}
                    onPress={() => handleEmail(item.email)}
                    activeOpacity={0.7}
                >
                    <Mail size={18} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Screen Header Layout */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("More")}
                    style={styles.backButton}
                    activeOpacity={0.7}
                   
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Representatives</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={reps}
                    keyExtractor={(item) => item.id || item.email}
                    renderItem={renderRepItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No representatives found.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default RepresentativesScreen;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl + 12,
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E2E8F0",
        backgroundColor: colors.surface,
    },
    backButton: {
        padding: spacing.xs,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContainer: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.md,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 2,
    },
    designation: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.primary,
        marginBottom: 2,
    },
    dept: {
        fontSize: 12,
        fontWeight: "500",
        color: "#64748B",
    },
    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: spacing.sm,
    },
    phoneButton: {
        backgroundColor: "#EFF6FF",
    },
    emailButton: {
        backgroundColor: "#EEF4FF",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 40,
    },
    emptyText: {
        color: "#94A3B8",
        fontSize: 16,
    },
});