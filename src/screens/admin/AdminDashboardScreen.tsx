import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import { colors, spacing } from "@/theme";

import FloatingNavbar from "@/screens/home/components/FloatingNavbar";

import AdminHeader from "./components/AdminHeader";
import AdminSection from "./components/AdminSection";

const AdminDashboardScreen = () => {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <AdminHeader />
                    <AdminSection />
                </ScrollView>

                <FloatingNavbar />
            </SafeAreaView>
        </>
    );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.lg,
    },
});