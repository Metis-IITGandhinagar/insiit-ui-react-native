import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import {
    ChevronRight,
    LucideIcon,
    Map,
    Users,
    UserRound,
    Settings,
    ShieldCheck,
    Info,
    Shield,
    Bug,
    BadgeInfo,
} from "lucide-react-native";

import { useTheme } from "@/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Item = {
    title: string;
    icon: LucideIcon;
    routeName?: keyof RootStackParamList;
};

type Section = {
    title: string;
    items: Item[];
};

interface MoreSectionProps {
    showToast: (message: string) => void;
}

const sections: Section[] = [
    {
        title: "Campus",
        items: [
            { title: "Campus Map", icon: Map },
            { title: "Representatives", icon: Users, routeName: "Representatives" },
        ],
    },
    {
        title: "Account",
        items: [
            { title: "Profile", icon: UserRound },
            { title: "Settings", icon: Settings },
            { title: "Admin Dashboard", icon: ShieldCheck, routeName: "AdminDashboard" as any },
        ],
    },
    {
        title: "About",
        items: [
            { title: "About INSIIT", icon: Info },
            { title: "Team INSIIT", icon: Users, routeName: "TeamINSIIT" },
            { title: "Privacy Policy", icon: Shield },
            { title: "Report Bug", icon: Bug },
            { title: "Version", icon: BadgeInfo, routeName: "VersionNerd" }, 
        ],
    },
];

const MoreSection = ({ showToast }: MoreSectionProps) => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const currentUserRole: 'student' | 'admin_events' = 'student';

    const handleRowPress = (item: Item) => {
        if (item.routeName === "AdminDashboard") {
            if (currentUserRole === 'student') {
                showToast("You are not an admin. Please contact metis@iitgn.ac.in");
                return;
            }
            navigation.navigate(item.routeName);
        } else if (item.routeName) {
            navigation.navigate(item.routeName);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {sections.map((section) => (
                <View key={section.title} style={styles.section}>
                    <Text style={styles.heading}>{section.title}</Text>
                    <View style={styles.card}>
                        {section.items.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <TouchableOpacity
                                    key={item.title}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.row,
                                        index !== section.items.length - 1 && styles.divider,
                                    ]}
                                    onPress={() => handleRowPress(item)}
                                >
                                    <View style={styles.left}>
                                        <View style={styles.iconContainer}>
                                            <Icon size={20} color={colors.primary} />
                                        </View>
                                        <Text style={styles.title}>{item.title}</Text>
                                    </View>
                                    {item.title === "Version" ? (
                                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#94A3B8" }}>
                                            v1.0.4
                                        </Text>
                                    ) : (
                                        <ChevronRight size={20} color="#94A3B8" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default MoreSection;

const getStyles = ({ colors, radius, spacing }: any) => StyleSheet.create({
    section: { marginBottom: spacing.sm },
    heading: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: spacing.md },
    card: { backgroundColor: colors.surface, borderRadius: radius.xl, elevation: 4, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
    row: {
        height: 68,
        paddingHorizontal: spacing.lg,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E5E7EB" },
    left: { flexDirection: "row", alignItems: "center" },
    iconContainer: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EEF4FF", justifyContent: "center", alignItems: "center", marginRight: spacing.md },
    title: { fontSize: 16, fontWeight: "600", color: colors.text },
});