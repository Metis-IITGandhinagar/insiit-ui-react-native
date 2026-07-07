import React, { useRef } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from "react-native";

import MessCard from "./components/MessCard";
import NextClassCard from "./components/NextClassCard";
import NextBusCard from "./components/NextBusCard";
import FloatingNavbar from "./components/FloatingNavbar";
import QRBottomSheet from "./components/QRBottomSheet";
import WeeklyMenuSheet from "./components/WeeklyMenuSheet";
import TimetableSheet from "./components/TimetableSheet";
import GreetingSection from "./components/GreetingSection";
import { colors, spacing } from "@/theme";
import type { QRBottomSheetRef } from "./components/QRBottomSheet";
import type { WeeklyMenuSheetRef } from "./components/WeeklyMenuSheet";
import type { TimetableSheetRef } from "./components/TimetableSheet";

const HomeScreen = () => {
    const qrSheetRef = useRef<QRBottomSheetRef>(null);
    const menuSheetRef = useRef<WeeklyMenuSheetRef>(null);
    const timetableSheetRef = useRef<TimetableSheetRef>(null);

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    
                    <GreetingSection />

                    <MessCard
                        meal={{
                            mealName: "Lunch",
                            time: "12:30 PM",
                            countdown: "1 hr 18 min",
                            featuredDish: "Paneer Butter Masala",
                            extraItems: 4,
                        }}
                        onShowQR={() => qrSheetRef.current?.expand()}
                        onShowMenu={() => menuSheetRef.current?.expand()}
                    />

                    <NextClassCard
                        onPress={() => timetableSheetRef.current?.expand()}
                    />

                    <NextBusCard />
                </ScrollView>

                <FloatingNavbar />

                <QRBottomSheet ref={qrSheetRef} />

                <WeeklyMenuSheet ref={menuSheetRef} />

                <TimetableSheet ref={timetableSheetRef} />
            </SafeAreaView>
        </>
    );
};

export default HomeScreen;

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