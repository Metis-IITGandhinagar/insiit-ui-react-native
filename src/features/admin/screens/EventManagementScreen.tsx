
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
    const { permissions, canManageEvents } = useAdminPermissions();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

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
                    onEdit={permissions?.post_event ? () => handleOpenAddModal() : undefined}
                    onDelete={() => handleDeleteEvent(item.id)}
                />
            </View>
        );
    }, [permissions, handleOpenDetailModal, handleOpenAddModal, handleDeleteEvent]);

    return (
        <PermissionGate hasPermission={canManageEvents}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.headerContainer]}>
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
                    <View style={[styles.centered]}>
                            <Text style={styles.errorTitle}>
                            Failed to Load Events
                        </Text>
                        <Text style={styles.errorSubtitle}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={refetch}
                            style={[styles.retryButton]}>
                            <RefreshCw size={16} color={colors.primary || '#FFFFFF'} style={{ marginRight: 8 }} />
                            <Text style={{ color: colors.primary || '#FFFFFF', fontWeight: '600' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={renderEventItem}
                        contentContainerStyle={[styles.listContent,]}
                        refreshing={isLoading}
                        onRefresh={refetch}
                        ListEmptyComponent={
                            <View style={[styles.centered]}>
                                <Text style={[ styles.emptyText]}>
                                    No events found.
                                </Text>
                            </View>
                        }
                    />
                )}

                {permissions?.post_event && (
                    <TouchableOpacity
                        style={[styles.fab]}
                        onPress={handleOpenAddModal}
                        activeOpacity={0.8}
                    >
                        <Plus size={24} color={'#FFFFFF'} />
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

const getStyles = ({ colors, radius, spacing, typography }: any) =>  StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        marginBottom: 8,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        paddingVertical: spacing.xxl
    },
    listContent: {
        flexGrow: 1,
        padding: spacing.lg,
    },
    cardContainer: {
        marginBottom: 16,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
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
        backgroundColor: colors.primary,
        borderRadius: radius.xl ?? 9999,
        bottom: spacing.xl,
        right: spacing.xl,
    },
    errorTitle:{
        color: colors.text,
        fontSize: typography.h3?.fontSize || 20,
        fontWeight: typography.h3?.fontWeight || '700',
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    errorSubtitle:{
        color: colors.textSecondary,
        fontSize: typography.h2?.fontSize || 14,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    emptyText:{

    }
});

