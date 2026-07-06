import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    StatusBar,
} from "react-native";

import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";

import { events } from "./data/events";
import FloatingNavbar from "../home/components/FloatingNavbar";
import { colors } from "@/theme";

export default function SearchScreen() {
    const [search, setSearch] = useState("");

    const filteredEvents = useMemo(() => {
        if (!search.trim()) return events;

        return events.filter((event) =>
            event.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                <View style={styles.header}>
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                    />

                    <Text style={styles.heading}>
                        {search.length === 0
                            ? `Upcoming Events (${filteredEvents.length})`
                            : `Results (${filteredEvents.length})`}
                    </Text>
                </View>

                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <EventCard
                            event={item}
                            onPress={() => { }}
                            onBookmark={() => { }}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>
                                No events found
                            </Text>

                            <Text style={styles.emptySubtitle}>
                                Try another search.
                            </Text>
                        </View>
                    }
                />
            </View>

            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FC",
    },

    content: {
        flex: 1,
    },

    header: {
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },

    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120, 
    },

    heading: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginHorizontal: 20,
        marginBottom: 5,
        paddingTop:20,
    },

    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#111827",
    },

    emptySubtitle: {
        marginTop: 8,
        color: "#6B7280",
        fontSize: 15,
    },
});