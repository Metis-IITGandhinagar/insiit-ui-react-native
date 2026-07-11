import React, { useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import EventDetailModal from "./components/EventDetailModal";

import { useEventData } from "./services/useEventData";
import { eventService } from "./services/eventService";
import { Event } from "./types";
import FloatingNavbar from "../home/components/FloatingNavbar";
import { useTheme } from "@/theme";

export default function SearchScreen() {
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const { eventsList, loading, refreshEvents } = useEventData();

    const filteredEvents = useMemo(() => {
        if (!search.trim()) return eventsList;
        return eventsList.filter((event) =>
            event.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, eventsList]);

    const handleOpenDetail = (event: Event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const handleDeleteEvent = (event: Event) => {
        Alert.alert(
            "Delete Event",
            `Remove "${event.title}" from campus feed?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success = await eventService.deleteEvent(event.id);
                        if (success) refreshEvents(); // Triggers instant pull-down sync representation
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                <View style={styles.header}>
                    <SearchBar value={search} onChangeText={setSearch} />
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
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refreshEvents}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    renderItem={({ item }) => (
                        <EventCard
                            event={item}
                            onPress={() => handleOpenDetail(item)}
                            onBookmark={() => { }}
                            onDelete={() => handleDeleteEvent(item)}
                        />
                    )}
                />
            </View>

            <EventDetailModal visible={modalVisible} event={selectedEvent} onClose={() => setModalVisible(false)} />
            <FloatingNavbar />
        </SafeAreaView>
    );
}

const getStyles = ({ colors, spacing, typography }: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { flex: 1 },
        header: { backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: spacing.md },
        listContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
        heading: { ...typography.h2, color: colors.text, marginHorizontal: spacing.lg, marginBottom: 5, paddingTop: spacing.lg },
    });