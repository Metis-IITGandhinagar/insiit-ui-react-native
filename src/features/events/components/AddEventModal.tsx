import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { ImagePlus, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { eventService, splitEventDateTime } from '../services/eventService';
import { Event } from '../services/searchTypes';
import { pickImagesAsBase64 } from '@/shared/media/pickImages';
import { useTheme } from '@core/theme';

const EMPTY_FORM = {
    title: '',
    venue: '',
    date: '',
    time: '',
    image: '',
    description: '',
};

interface Props {
    visible: boolean;
    event?: Event | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddEventModal({ visible, event, onClose, onSuccess }: Props) {
    const theme = useTheme();
    const { colors, spacing, typography } = theme;
    const styles = getStyles(theme);
    const insets = useSafeAreaInsets();

    const isEditing = !!event;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!visible) return;

        if (event) {
            const { date, time } = splitEventDateTime(event.startDateTime);
            setFormData({
                title: event.title,
                venue: event.venue,
                date,
                time,
                image: event.image,
                description: event.description,
            });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [visible, event]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePickPoster = async () => {
        try {
            const [picked] = await pickImagesAsBase64(1);
            if (picked) handleChange('image', picked);
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Could not open your photo library.');
        }
    };

    const parseDateTime = (dateStr: string, timeStr: string) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        let hours = 0;
        let minutes = 0;

        if (timeStr) {
            const parts = timeStr.split(' ');
            if (parts.length === 2) {
                const [timePart, modifier] = parts;
                const timeSubParts = timePart.split(':').map(Number);
                if (timeSubParts.length === 2) {
                    let [h, m] = timeSubParts;
                    if (modifier === 'PM' && h < 12) h += 12;
                    if (modifier === 'AM' && h === 12) h = 0;
                    hours = h;
                    minutes = m;
                }
            }
        }
        return new Date(year, month - 1, day, hours, minutes, 0);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.date || !formData.venue) {
            Alert.alert("Missing Fields", "Please fill in the title, date, and venue.");
            return;
        }

        const selectedDateTime = parseDateTime(formData.date, formData.time);
        if (selectedDateTime && selectedDateTime.getTime() < Date.now()) {
            Alert.alert("Invalid Date & Time", "Event date and time cannot be in the past.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (event) {
                await eventService.updateEvent(event.id, formData);
                Alert.alert("Success", "Event updated successfully!");
            } else {
                await eventService.addEvent(formData);
                Alert.alert("Success", "Event submitted for approval!");
            }
            setFormData(EMPTY_FORM);
            onSuccess();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.message ||
                (event
                    ? "Failed to update event. You can only edit events you created."
                    : "Failed to create event. Please try again.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const headerPaddingTop = Platform.OS === 'android' ? insets.top + spacing.lg : spacing.lg;

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
                    <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{isEditing ? 'Edit Event' : 'New Event'}</Text>
                    <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.primary} size="small" />
                        ) : (
                            <Text style={styles.saveText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.formContainer}>
                    {formData.image ? (
                        <View style={styles.posterWrap}>
                            <Image source={{ uri: formData.image }} style={styles.poster} />
                            <TouchableOpacity
                                style={styles.posterRemove}
                                onPress={() => handleChange('image', '')}
                            >
                                <X size={14} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.posterPicker} onPress={handlePickPoster}>
                            <ImagePlus size={20} color={colors.textSecondary} />
                            <Text style={styles.posterPickerText}>
                                {isEditing ? 'Replace poster (optional)' : 'Add a poster (optional)'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginRight: 8 }]}
                            placeholder="Date (YYYY-MM-DD)"
                            placeholderTextColor="#999"
                            value={formData.date}
                            onChangeText={(val) => handleChange('date', val)}
                        />
                        <TextInput
                            style={[styles.input, { flex: 1, marginLeft: 8 }]}
                            placeholder="Time (HH:MM AM/PM)"
                            placeholderTextColor="#999"
                            value={formData.time}
                            onChangeText={(val) => handleChange('time', val)}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Event Title"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.title}
                        onChangeText={(val) => handleChange('title', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Venue"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.venue}
                        onChangeText={(val) => handleChange('venue', val)}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Event Description..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        value={formData.description}
                        onChangeText={(val) => handleChange('description', val)}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const getStyles = ({ colors, spacing, typography, radius }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        ...typography.h3,
        color: colors.text,
    },
    cancelText: {
        color: colors.error || 'red',
        fontSize: 16,
    },
    saveText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        padding: spacing.lg,
    },
    posterPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.lg,
        borderRadius: radius.md,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.border,
        marginBottom: 16,
    },
    pickerInput: {
        justifyContent: 'center',
    },
    posterPickerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    posterWrap: {
        marginBottom: 16,
    },
    poster: {
        width: '100%',
        height: 180,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    posterRemove: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    }
});