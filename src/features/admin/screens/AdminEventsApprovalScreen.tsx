// screens/AdminEventsApprovalScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/theme';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { PermissionGate } from '../components/PermissionGate';
import { Event } from '@/features/events/services/searchTypes'
import { Ionicons } from '@expo/vector-icons';
import { eventService } from '@/features/events/services/eventService';

export default function AdminEventsApprovalScreen() {
    const theme = useTheme();
    const { colors, spacing, typography } = theme;
    const styles = getStyles(theme);

    const { canManageEvents, isLoading: permissionsLoading } = useAdminPermissions();
    const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPendingEvents = async () => {
        try {
            setLoading(true);
            // Fetch events filtered by pending status
            const data = await eventService.fetchPendingEvents();
            setPendingEvents(data);
        } catch (error: any) {
            Alert.alert("Error", error?.message || "Failed to load pending events.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (canManageEvents) {
            fetchPendingEvents();
        }
    }, [canManageEvents]);

    const handleApprove = async (eventId: string) => {
        try {
            await eventService.approveEvent(eventId);
            Alert.alert("Success", "Event approved and published to the campus feed.");
            setPendingEvents(prev => prev.filter(e => e.id !== eventId));
        } catch (error: any) {
            Alert.alert("Error", error?.message || "Failed to approve event.");
        }
    };

    const handleReject = async (eventId: string) => {
        Alert.alert(
            "Reject Event",
            "Are you sure you want to reject and delete this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reject",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await eventService.rejectEvent(eventId);
                            setPendingEvents(prev => prev.filter(e => e.id !== eventId));
                        } catch (error: any) {
                            Alert.alert("Error", error?.message || "Failed to reject event.");
                        }
                    }
                }
            ]
        );
    };

    if (permissionsLoading) {
        return <View style={styles.center}><Text>Checking permissions...</Text></View>;
    }

    return (
        <PermissionGate hasPermission={canManageEvents}>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Pending Event Approvals ({pendingEvents.length})</Text>
                </View>

                <FlatList
                    data={pendingEvents}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshing={loading}
                    onRefresh={fetchPendingEvents}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No events pending approval.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
                            <View style={styles.cardContent}>
                                <Text style={styles.eventTitle}>{item.title}</Text>
                                <Text style={styles.metaText}>Venue: {item.venue}</Text>
                                <Text style={styles.metaText}>Date: {item.date} • {item.time}</Text>
                                <Text style={styles.authorText}>Submitted by: {item.addedByEmail}</Text>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={() => handleReject(item.id)}>
                                        <Ionicons name="close" size={18} color="#EF4444" />
                                        <Text style={styles.rejectText}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btn, styles.approveBtn]} onPress={() => handleApprove(item.id)}>
                                        <Ionicons name="checkmark" size={18} color="#FFF" />
                                        <Text style={styles.approveText}>Approve</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </SafeAreaView>
        </PermissionGate>
    );
}

const getStyles = ({ colors, spacing, typography }: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    title: { ...typography.h2, color: colors.text },
    list: { padding: spacing.lg },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
    emptyText: { color: colors.textSecondary, fontSize: 16 },
    card: { backgroundColor: colors.surface, borderRadius: 12, marginBottom: spacing.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    image: { width: '100%', height: 160 },
    cardContent: { padding: spacing.md },
    eventTitle: { ...typography.h3, color: colors.text, marginBottom: 4 },
    metaText: { color: colors.textSecondary, fontSize: 14, marginBottom: 2 },
    authorText: { color: colors.primary, fontSize: 12, marginBottom: spacing.md, fontStyle: 'italic' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
    btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, gap: 4 },
    rejectBtn: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5' },
    rejectText: { color: '#EF4444', fontWeight: '600' },
    approveBtn: { backgroundColor: colors.primary },
    approveText: { color: '#FFF', fontWeight: '600' },
});