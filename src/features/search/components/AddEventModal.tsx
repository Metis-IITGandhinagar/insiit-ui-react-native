import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { eventService } from '../services/eventService';
import { useTheme } from '@core/theme';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddEventModal({ visible, onClose, onSuccess }: Props) {
    const theme = useTheme();
    const { colors, spacing, typography } = theme;
    const styles = getStyles(theme);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        venue: '',
        date: '',
        time: '',
        image: '',
        description: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.date || !formData.venue) {
            Alert.alert("Missing Fields", "Please fill in the title, date, and venue.");
            return;
        }

        setIsSubmitting(true);
        try {
            await eventService.addEvent(formData);
            Alert.alert("Success", "Event created successfully!");
            setFormData({ title: '', venue: '', date: '', time: '', image: '', description: '' });
            onSuccess();
        } catch (error) {
            Alert.alert("Error", "Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>New Event</Text>
                    <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.primary} size="small" />
                        ) : (
                            <Text style={styles.saveText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Event Title"
                        placeholderTextColor="#999"
                        value={formData.title}
                        onChangeText={(val) => handleChange('title', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Venue"
                        placeholderTextColor="#999"
                        value={formData.venue}
                        onChangeText={(val) => handleChange('venue', val)}
                    />
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
                        placeholder="Poster Image URL (Optional)"
                        placeholderTextColor="#999"
                        value={formData.image}
                        onChangeText={(val) => handleChange('image', val)}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Event Description..."
                        placeholderTextColor="#999"
                        multiline
                        value={formData.description}
                        onChangeText={(val) => handleChange('description', val)}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const getStyles = ({ colors, spacing, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
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
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        color: colors.text,
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