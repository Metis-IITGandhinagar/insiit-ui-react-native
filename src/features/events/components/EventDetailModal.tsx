import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/theme';
import SheetModal from '@shared/components/SheetModal';
import { Event } from '../services/searchTypes';

interface EventDetailModalProps {
    visible: boolean;
    event: Event | null;
    onClose: () => void;
    onToggleReminder?: () => void;
    isReminded?: boolean;
}

const EventDetailModal = ({ visible, event, onClose, onToggleReminder, isReminded }: EventDetailModalProps) => {
    const theme = useTheme();
    const { colors, radius, spacing, typography } = theme;
    const styles = getStyles(theme);

    if (!event) return null;

    const hasImage = Boolean(event.image && event.image.trim());

    return (
        <SheetModal visible={visible} onClose={onClose} sheetStyle={styles.sheetCap}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                {hasImage && <Image source={{ uri: event.image }} style={styles.image} />}

                <ScrollView contentContainerStyle={styles.body}>
                    <Text style={styles.title}>{event.title}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                        <Text style={styles.infoText}>{event.venue}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                        <Text style={styles.infoText}>
                            {event.date} • {event.time}
                        </Text>
                    </View>

                    {onToggleReminder && (
                        <TouchableOpacity
                            style={[
                                styles.reminderButton,
                                {
                                    backgroundColor: isReminded ? colors.primaryLight : colors.primary,
                                    borderColor: isReminded ? colors.primary : "transparent",
                                }
                            ]}
                            onPress={onToggleReminder}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={isReminded ? "notifications" : "notifications-outline"}
                                size={18}
                                color={isReminded ? colors.primary : colors.onPrimary}
                            />
                            <Text
                                style={[
                                    styles.reminderButtonText,
                                    { color: isReminded ? colors.primary : colors.onPrimary }
                                ]}
                            >
                                {isReminded ? "Reminder Set (Tap to remove)" : "Notify Me Before Event"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.divider} />

                    <Text style={styles.descriptionTitle}>About Event</Text>
                    <Text style={styles.descriptionText}>
                        {event.description || 'No description provided for this event.'}
                    </Text>
                </ScrollView>
            </View>
        </SheetModal>
    );
};

export default EventDetailModal;

const getStyles = ({ colors, radius, spacing, typography }: any) =>
    StyleSheet.create({
        sheetCap: {
            maxHeight: '80%',
        },
        modalContent: {
            width: '100%',
            flexShrink: 1,
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
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
        reminderButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: radius.md,
            marginTop: spacing.md,
            borderWidth: 1,
        },
        reminderButtonText: {
            fontSize: 14,
            fontWeight: '600',
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
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