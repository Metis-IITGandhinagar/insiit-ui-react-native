import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { busService } from '../services/busServices';
import { useTheme } from '@/core/theme';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddBusModal({ visible, onClose, onSuccess }: Props) {
    const theme = useTheme();
    const { colors, spacing, typography } = theme;
    const styles = getStyles(theme);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        BusName: '56', // Default to 56 seater
        DepartureTime: '',
        Source: '',
        Destination: '',
        Stops: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.DepartureTime || !formData.Source || !formData.Destination) {
            Alert.alert("Missing Fields", "Please provide a time, source, and destination.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert comma separated string to array and trim spaces
            const stopsArray = formData.Stops
                ? formData.Stops.split(',').map(s => s.trim()).filter(s => s !== '')
                : [];

            await busService.createBus({
                BusName: formData.BusName,
                DepartureTime: formData.DepartureTime,
                Source: formData.Source,
                Destination: formData.Destination,
                Stops: stopsArray
            });

            Alert.alert("Success", "Bus schedule added successfully!");
            setFormData({ BusName: '56', DepartureTime: '', Source: '', Destination: '', Stops: '' });
            onSuccess();
        } catch (error) {
            Alert.alert("Error", "Failed to add bus schedule. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>New Bus Schedule</Text>
                    <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.primary} size="small" />
                        ) : (
                            <Text style={styles.saveText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.label}>Bus Type (e.g., 56, 29, EECO)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Bus Type"
                        placeholderTextColor="#999"
                        value={formData.BusName}
                        onChangeText={(val) => handleChange('BusName', val)}
                    />

                    <Text style={styles.label}>Departure Time</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 08:30 AM"
                        placeholderTextColor="#999"
                        value={formData.DepartureTime}
                        onChangeText={(val) => handleChange('DepartureTime', val)}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.label}>Source</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Palaj"
                                placeholderTextColor="#999"
                                value={formData.Source}
                                onChangeText={(val) => handleChange('Source', val)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.label}>Destination</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Visat"
                                placeholderTextColor="#999"
                                value={formData.Destination}
                                onChangeText={(val) => handleChange('Destination', val)}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Intermediate Stops</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Comma separated (e.g., Raksha Shakti, PDPU)"
                        placeholderTextColor="#999"
                        multiline
                        value={formData.Stops}
                        onChangeText={(val) => handleChange('Stops', val)}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const getStyles = ({ colors, spacing, typography }: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    title: { ...typography.h3, color: colors.text },
    cancelText: { color: colors.error || 'red', fontSize: 16 },
    saveText: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
    formContainer: { padding: spacing.lg },
    label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 4 },
    input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, color: colors.text },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    textArea: { height: 100, textAlignVertical: 'top' }
});