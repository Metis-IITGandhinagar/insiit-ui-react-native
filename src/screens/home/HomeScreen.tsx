import React, { useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    StatusBar,
} from "react-native";
import MessCard from "./components/MessCard";
import NextClassCard from "./components/NextClassCard";
import NextBusCard from "./components/NextBusCard";
import FloatingNavbar from "./components/FloatingNavbar";
import QRBottomSheet from "./components/QRBottomSheet";
import WeeklyMenuSheet from "./components/WeeklyMenuSheet";
import TimetableSheet from "./components/TimetableSheet";
import GreetingSection from "./components/GreetingSection";

const HomeScreen = () => {
    const qrSheetRef = useRef<any>(null);
    const menuSheetRef = useRef<any>(null);
    const timetableSheetRef = useRef<any>(null);

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F8FC" />

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
        backgroundColor: "#F5F8FC",
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 120,
        gap: 20,
    },
});