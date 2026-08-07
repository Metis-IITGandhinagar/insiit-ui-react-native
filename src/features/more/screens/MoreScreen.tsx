import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Map, Users, Settings, Info, ShieldCheck, Bug, Megaphone } from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/core/navigation/types";


import { useTheme } from "../../../core/theme";
import { Card } from "../../../shared/components/Card";
import { ListItem } from "../../../shared/components/ListItem";
import ProfileHeroCard from "../components/ProfileHeroCard";
import { useAuth } from "@/core/auth/useAuth";
import { openLink } from "@/utils/linking";
import { LINKS } from "@/constants/links";
import appConfig from "../../../../app.json";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MoreScreen = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const navigation = useNavigation<NavigationProp>();
    const { user } = useAuth();

    // Any admin-ish permission is enough to make the console worth showing.
    const isAdmin = !!user?.permissions && Object.values(user.permissions).some(Boolean);

    const SectionTitle = ({ title }: { title: string }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    return (
        <>
            <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>

                    {/* Screen Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.screenTitle}>More</Text>
                        <Text style={styles.screenSubtitle}>Account, campus & app settings</Text>
                    </View>

                    {/* Top Hero Card */}
                    <ProfileHeroCard />

                    {/* Campus Section */}
                    <SectionTitle title="Campus" />
                    <Card style={styles.listCard}>
                        <ListItem
                            leadingIcon={<Map size={22} color={colors.primary} />}
                            title="Campus Map"
                            onPress={() => navigation.navigate("CampusMap")}
                            showDivider={true}
                        />
                        <ListItem
                            leadingIcon={<Megaphone size={22} color={colors.primary} />}
                            title="Announcements"
                            onPress={() => navigation.navigate("Announcements")}
                            showDivider={true}
                        />
                        <ListItem
                            leadingIcon={<Users size={22} color={colors.primary} />}
                            title="Representatives"
                            onPress={() => navigation.navigate("Representatives")}
                            showDivider={false}
                        />
                    </Card>

                    {/* Account Section */}
                    <SectionTitle title="Account" />
                    <Card style={styles.listCard}>
                        <ListItem
                            leadingIcon={<Settings size={22} color={colors.primary} />}
                            title="Settings"
                            onPress={() => navigation.navigate("Settings")}
                            showDivider={isAdmin}
                        />
                        {/* Hidden for guests and ordinary students — the console is empty
                            without permissions, and guests hold none by definition. */}
                        {isAdmin && (
                            <ListItem
                                leadingIcon={<ShieldCheck size={22} color={colors.primary} />}
                                title="Admin Dashboard"
                                onPress={() => navigation.navigate("AdminDashboard")}
                                showDivider={false}
                            />
                        )}
                    </Card>

                    {/* About Section */}
                    <SectionTitle title="About" />
                    <Card style={styles.listCard}>
                        <ListItem
                            leadingIcon={<Info size={22} color={colors.primary} />}
                            title="About INSIIT"
                            onPress={() => navigation.navigate("AboutInsiit")}
                            showDivider={true}
                        />
                        <ListItem
                            leadingIcon={<Users size={22} color={colors.primary} />}
                            title="Team INSIIT"
                            onPress={() => navigation.navigate("TeamINSIIT")}
                            showDivider={true}
                        />
                        <ListItem
                            leadingIcon={<ShieldCheck size={22} color={colors.primary} />}
                            title="Privacy Policy"
                            onPress={() => navigation.navigate("PrivacyPolicy")}
                            showDivider={true}
                        />
                        <ListItem
                            leadingIcon={<Bug size={22} color={colors.primary} />}
                            title="Report Bug"
                            subtitle="Opens GitHub issues"
                            onPress={() => openLink(LINKS.issues)}
                            showDivider={true}
                        />
                        {/* Not tappable: the version is the whole content of the row. */}
                        <ListItem
                            leadingIcon={<Info size={22} color={colors.primary} />}
                            title="Version"
                            subtitle={appConfig.expo.version}
                            showChevron={false}
                            showDivider={false}
                        />
                    </Card>

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>
                            Made with <Text style={{ color: 'red' }}>❤</Text> by Team INSIIT
                        </Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default MoreScreen;

const getStyles = ({ colors, spacing, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background || '#F2F4F7',
    },
    contentScroll: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 100, // Accounts for bottom nav bar
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    screenSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    listCard: {
        padding: 0, // Override default Card padding so ListItems sit flush
        overflow: 'hidden',
    },
    footerContainer: {
        marginTop: spacing.xxxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    }
});