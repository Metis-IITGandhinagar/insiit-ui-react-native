import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import AdminHeader from "../components/AdminHeader";
import MonthSelector from "./components/MonthSelector";
import UploadCard from "./components/UploadCard";
import PreviewCard from "./components/PreviewCard";
import PublishCard from "./components/PublishCard";
import { colors, spacing } from "@/theme";

const UpdateMessMenuScreen = () => {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <AdminHeader />

                    <MonthSelector />

                    <UploadCard />

                    <PreviewCard />

                    <PublishCard />
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default UpdateMessMenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
    },
});