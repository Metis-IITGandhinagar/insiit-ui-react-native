import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking, 
    Platform,
} from "react-native";
import {
    Phone,
    Wrench,
    HeartPulse,
    ChevronRight,
} from "lucide-react-native";

import {
    useTheme
} from "@/theme";
import Card from "@/components/Card";

const EmergencyCard = () => {

        const emergencyNumber = "7069795000";
        const makeCall = async () => {
            try {
                await Linking.openURL(`tel:${emergencyNumber}`);
            } catch (error) {
                console.error("Could not open phone app:", error);
            }
        };

        const theme = useTheme();
        const { colors } = theme;
        const styles = getStyles(theme);
    return (
        <Card>
            <View style={styles.header}>
                <View>
                    <Text style={styles.label}>
                        QUICK ACCESS
                    </Text>
                    <Text style={styles.title}>
                        Emergency Services
                    </Text>
                </View>
                <TouchableOpacity onPress={makeCall} style={styles.phoneCircle}>
                <View style={styles.phoneCircle}>
                    
                    <Phone
                        size={24}
                        color={colors.danger}
                        strokeWidth={2.2}
                    />

                </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.action}>
                <View style={styles.left}>
                    <View
                        style={[
                            styles.iconBackground,
                            { backgroundColor: "#FEF3C7" },
                        ]}
                    >
                        <Wrench
                            size={20}
                            color="#D97706"
                        />
                    </View>

                    <View>
                        <Text style={styles.actionTitle}>
                            Maintenance
                        </Text>

                        <Text style={styles.actionSubtitle}>
                            Report hostel & campus issues
                        </Text>
                    </View>
                </View>

                <ChevronRight
                    size={20}
                    color="#94A3B8"
                />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.action}
            >
                <View style={styles.left}>
                    <View
                        style={[
                            styles.iconBackground,
                            { backgroundColor: "#DCFCE7" },
                        ]}
                    >
                        <HeartPulse
                            size={20}
                            color="#16A34A"
                        />
                    </View>

                    <View>
                        <Text style={styles.actionTitle}>
                            Medical
                        </Text>

                        <Text style={styles.actionSubtitle}>
                            Health centre & ambulance
                        </Text>
                    </View>
                </View>

                <ChevronRight
                    size={20}
                    color="#94A3B8"
                />
            </TouchableOpacity>
        </Card>
    );
};

export default EmergencyCard;

const getStyles = ({ colors, radius, shadows, spacing, typography }: any) =>StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        marginBottom: 20,
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        color: colors.primary,
    },

    title: {
        marginTop: 4,
        fontSize: 24,
        fontWeight: "800",
        color: colors.text,
    },

    phoneCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#EEF4FF",

        justifyContent: "center",
        alignItems: "center",
    },

    action: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        paddingVertical: 14,

        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBackground: {
        width: 46,
        height: 46,
        borderRadius: 23,

        justifyContent: "center",
        alignItems: "center",

        marginRight: spacing.md,
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },

    actionSubtitle: {
        marginTop: 3,
        fontSize: 13,
        color: colors.textSecondary,
    },
});