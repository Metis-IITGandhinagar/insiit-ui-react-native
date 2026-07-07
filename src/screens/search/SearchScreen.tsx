import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";

import { events } from "./data/events";
import FloatingNavbar from "../home/components/FloatingNavbar";
import { colors, spacing, typography } from "@/theme";

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
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingTop: 50,
        paddingBottom: spacing.md,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 120,
    },
    heading: {
        ...typography.h2,
        color: colors.text,
        marginHorizontal: spacing.lg,
        marginBottom: 5,
        paddingTop: spacing.lg,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.text,
    },
    emptySubtitle: {
        marginTop: spacing.sm,
        color: colors.textSecondary,
        ...typography.body,
    },
});