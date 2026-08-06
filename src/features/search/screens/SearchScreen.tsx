import React, { useMemo, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import EventDetailModal from "../components/EventDetailModal";
import AddEventModal from "../components/AddEventModal";

import { useEventData } from "../hooks/useEventData";
import { eventService } from "../services/eventService";
import { Event } from "../services/searchTypes";
import { useTheme } from "@core/theme";
import { useAuth } from "@core/auth/useAuth";

export default function SearchScreen() {
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    // Non-null while the form is open for an edit; null means "new event".
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const theme = useTheme();
    const { colors, spacing } = theme;
    const styles = getStyles(theme);

    const { hasPermission, user } = useAuth();
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
                        try {
                            await eventService.deleteEvent(event.id);
                            refreshEvents();
                        } catch {
                            Alert.alert(
                                "Error",
                                "You can only delete events that you created."
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

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
                                onPress={() => {
                                    setEditingEvent(null);
                                    setAddModalVisible(true);
                                }}
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
                    renderItem={({ item }) => {
                        // The backend scopes edit/delete to the author, so only show the
                        // controls that would actually succeed.
                        const isAuthor = !!user?.email && user.email === item.addedByEmail;

                        return (
                            <EventCard
                                event={item}
                                onPress={() => handleOpenDetail(item)}
                                onBookmark={() => { }}
                                onEdit={isAuthor ? () => {
                                    setEditingEvent(item);
                                    setAddModalVisible(true);
                                } : undefined}
                                onDelete={isAuthor ? () => handleDeleteEvent(item) : undefined}
                            />
                        );
                    }}
                />
            </View>

            <EventDetailModal visible={modalVisible} event={selectedEvent} onClose={() => setModalVisible(false)} />

            <AddEventModal
                visible={addModalVisible}
                event={editingEvent}
                onClose={() => {
                    setAddModalVisible(false);
                    setEditingEvent(null);
                }}
                onSuccess={() => {
                    setAddModalVisible(false);
                    setEditingEvent(null);
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