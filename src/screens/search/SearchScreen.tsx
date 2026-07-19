// src/screens/search/SearchScreen.tsx
import React, { useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBar from "./components/SearchBar";
import EventCard from "./components/EventCard";
import EventDetailModal from "./components/EventDetailModal";
import AddEventModal from "./components/AddEventModal";

import { useEventData } from "./services/useEventData";
import { eventService } from "./services/eventService";
import { Event } from "./types";
import { useTheme } from "@/core/theme";
import { useAuth } from "@core/auth/useAuth";

export default function SearchScreen() {
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const theme = useTheme();
    const { colors, spacing } = theme;
    const styles = getStyles(theme);

    const { hasPermission } = useAuth();

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
        if (!hasPermission('delete_event')) {
            Alert.alert("Unauthorized", "You do not have permission to delete events.");
            return;
        }

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
                        if (success) refreshEvents();
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

                    <View style={styles.headerRow}>
                        <Text style={styles.heading}>
                            {search.length === 0
                                ? `Upcoming Events (${filteredEvents.length})`
                                : `Results (${filteredEvents.length})`}
                        </Text>

                        {hasPermission('post_event') && (
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: colors.primary }]}
                                onPress={() => setAddModalVisible(true)}
                            >
                                <Text style={styles.addButtonText}>+ Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>
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

            <AddEventModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSuccess={() => {
                    setAddModalVisible(false);
                    refreshEvents();
                }}
            />
        </SafeAreaView>
    );
}

const getStyles = ({ colors, spacing, typography }: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { flex: 1 },
        header: { backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: 10, paddingBottom: spacing.md },
        headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
        listContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
        heading: { ...typography.h2, color: colors.text, marginBottom: 5 },
        addButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
        addButtonText: { color: '#FFF', fontWeight: 'bold' }
    });