import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import { colors, spacing } from "@/theme";

import FloatingNavbar from "../home/components/FloatingNavbar";

import MoreHeader from "./components/MoreHeader";
import MoreSection from "./components/MoreSection";
import AppInfoCard from "./components/AppInfoCard";
import UserCard from "./components/UserCard";

const MoreScreen = () => {
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
                    <MoreHeader />

                    <UserCard />

                    <MoreSection />

                    <AppInfoCard />
                </ScrollView>

                <FloatingNavbar />
            </SafeAreaView>
        </>
    );
};

export default MoreScreen;

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