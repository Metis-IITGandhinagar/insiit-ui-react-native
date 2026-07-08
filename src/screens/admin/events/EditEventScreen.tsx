import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
} from "react-native";

import { colors, spacing } from "@/theme";

import AdminHeader from "../components/AdminHeader";

import EventImageCard from "./components/EventImageCard";
import EventDetailsCard from "./components/EventDetailsCard";
import EventDescriptionCard from "./components/EventDescriptionCard";
import EventPublishCard from "./components/EventPublishCard";

const EditEventScreen = () => {
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

                    <EventImageCard />

                    <EventDetailsCard />

                    <EventDescriptionCard />

                    <EventPublishCard />
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default EditEventScreen;

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