
import React, { useState, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Plus, Trash2, Edit2, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { PermissionGate } from '../components/PermissionGate';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { adminService } from '../services/adminService';
import EventCard from '@features/search/components/EventCard';
import EventDetailModal from '@features/search/components/EventDetailModal';
import AddEventModal from '@features/search/components/AddEventModal';
import SearchBar from '@features/search/components/SearchBar';
import { useEventData } from '@features/search/hooks/useEventData';
import { Event } from '@features/search/services/searchTypes';

export const EventManagementScreen: React.FC = () => {
    const { colors, spacing, typography, radius } = useTheme();
    const { permissions, canManageEvents } = useAdminPermissions();

    const { eventsList, loading: isLoading, error, refreshEvents: refetch } = useEventData();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) return eventsList;
        const query = searchQuery.toLowerCase();
        return eventsList.filter(
            (event) =>
                event.title.toLowerCase().includes(query) ||
                event.venue?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query)
        );
    }, [eventsList, searchQuery]);

    const handleOpenAddModal = useCallback(() => {
        setIsAddEditModalOpen(true);
    }, []);

    const handleOpenDetailModal = useCallback((event: Event) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    }, []);

    const handleDeleteEvent = useCallback((eventId: string) => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to permanently delete this event? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(eventId);
                            await adminService.deleteEvent(eventId);
                            await refetch();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete event. Please try again.');
                        } finally {
                            setIsDeleting(null);
                        }
                    },
                },
            ]
        );
    }, [refetch]);

    const renderEventItem = useCallback(({ item }: { item: Event }) => {
        return (
            <View style={styles.cardContainer}>
                <EventCard
                    event={item}
                    onPress={() => handleOpenDetailModal(item)}
                    onEdit={permissions?.put_event ? () => handleOpenAddModal() : undefined}
                    onDelete={() => handleDeleteEvent(item.id)}
                />
            </View>
        );
    }, [permissions, handleOpenDetailModal, handleOpenAddModal, handleDeleteEvent]);

    return (
        <PermissionGate hasPermission={canManageEvents}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.headerContainer, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {isLoading && !eventsList.length ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error && !eventsList.length ? (
                    <View style={[styles.centered, { padding: spacing.xl }]}>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: typography.h3?.fontSize || 20,
                                fontWeight: typography.h3?.fontWeight || '700',
                                marginBottom: spacing.xs,
                                textAlign: 'center',
                            }}
                        >
                            Failed to Load Events
                        </Text>
                        <Text
                            style={{
                                color: colors.textSecondary,
                                fontSize: typography.h2?.fontSize || 14,
                                marginBottom: spacing.lg,
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={refetch}
                            style={[
                                styles.retryButton,
                                {
                                    backgroundColor: colors.primary,
                                    paddingHorizontal: spacing.lg,
                                    paddingVertical: spacing.md,
                                    borderRadius: radius.md,
                                },
                            ]}
                        >
                            <RefreshCw size={16} color={colors.primary || '#FFFFFF'} style={{ marginRight: 8 }} />
                            <Text style={{ color: colors.primary || '#FFFFFF', fontWeight: '600' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={renderEventItem}
                        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
                        refreshing={isLoading}
                        onRefresh={refetch}
                        ListEmptyComponent={
                            <View style={[styles.centered, { paddingVertical: spacing.xxl }]}>
                                <Text style={{ color: colors.textSecondary, fontSize: typography.h1?.fontSize || 16 }}>
                                    No events found.
                                </Text>
                            </View>
                        }
                    />
                )}

                {permissions?.post_event && (
                    <TouchableOpacity
                        style={[
                            styles.fab,
                            {
                                backgroundColor: colors.primary,
                                borderRadius: radius.xl ?? 9999,
                                bottom: spacing.xl,
                                right: spacing.xl,
                            },
                        ]}
                        onPress={handleOpenAddModal}
                        activeOpacity={0.8}
                    >
                        <Plus size={24} color={colors.primary || '#FFFFFF'} />
                    </TouchableOpacity>
                )}

                <EventDetailModal
                    visible={isDetailModalOpen}
                    event={selectedEvent}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedEvent(null);
                    }}
                />

                <AddEventModal
                    visible={isAddEditModalOpen}
                    onClose={() => {
                        setIsAddEditModalOpen(false);
                    }}
                    onSuccess={() => {
                        setIsAddEditModalOpen(false);
                        refetch();
                    }}
                />
            </View>
        </PermissionGate>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        marginBottom: 8,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        flexGrow: 1,
    },
    cardContainer: {
        marginBottom: 16,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
});

