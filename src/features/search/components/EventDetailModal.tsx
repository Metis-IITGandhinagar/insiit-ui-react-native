import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/theme';
import { Event } from '../services/searchTypes';

interface EventDetailModalProps {
    visible: boolean;
    event: Event | null;
    onClose: () => void;
}

const EventDetailModal = ({ visible, event, onClose }: EventDetailModalProps) => {
    const theme = useTheme();
    const { colors, radius, spacing, typography } = theme;
    const styles = getStyles(theme);

    if (!event) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>

                        <Image source={{ uri: event.image }} style={styles.image} />

                        <ScrollView contentContainerStyle={styles.body}>
                            <Text style={styles.title}>{event.title}</Text>

                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={18} color={colors.textSecondary || '#6B7280'} />
                                <Text style={styles.infoText}>{event.venue}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary || '#6B7280'} />
                                <Text style={styles.infoText}>
                                    {event.date} • {event.time}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.descriptionTitle}>About Event</Text>
                            <Text style={styles.descriptionText}>
                                {event.description || 'No description provided for this event.'}
                            </Text>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default EventDetailModal;

const getStyles = ({ colors, radius, spacing, typography }: any) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.xl,
        },
        modalContent: {
            width: '100%',
            maxHeight: '80%',
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            overflow: 'hidden',
            position: 'relative',
            elevation: 24,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
        },
        closeButton: {
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 10,
            backgroundColor: colors.surface,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        image: {
            width: '100%',
            height: 220,
        },
        body: {
            padding: spacing.lg,
        },
        title: {
            ...typography.h2,
            color: colors.text,
            marginBottom: spacing.md,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        infoText: {
            marginLeft: spacing.sm,
            ...typography.body,
            color: colors.textSecondary,
        },
        divider: {
            height: 1,
            backgroundColor: '#E5E7EB',
            marginVertical: spacing.lg,
        },
        descriptionTitle: {
            ...typography.h3,
            color: colors.text,
            marginBottom: spacing.sm,
        },
        descriptionText: {
            ...typography.body,
            color: colors.textSecondary,
            lineHeight: 22,
        },
    });