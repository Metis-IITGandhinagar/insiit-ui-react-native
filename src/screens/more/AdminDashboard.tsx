import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { eventService } from '../search/services/eventService';

export default function AdminDashboard() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors, radius, spacing, typography } = theme;
    const styles = getStyles(theme);

    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !venue.trim() || !date.trim() || !time.trim()) {
            Alert.alert('Required Fields Missing', 'Please fill in Title, Venue, Date, and Time.');
            return;
        }

        setIsSubmitting(true);
        try {
            await eventService.addEvent({
                title: title.trim(),
                venue: venue.trim(),
                date: date.trim(),
                time: time.trim(),
                image: image.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
                description: description.trim(),
            });

            Alert.alert('Success', 'Event published successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Submission Failed', 'Could not post the event to the campus database.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <Text style={styles.sectionTitle}>Create Campus Event</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Event Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. HackRush 2026"
                            placeholderTextColor="#94A3B8"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Venue Location *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Academic Block 5"
                            placeholderTextColor="#94A3B8"
                            value={venue}
                            onChangeText={setVenue}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Date *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 12 Jul"
                                placeholderTextColor="#94A3B8"
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Time *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 6:00 PM"
                                placeholderTextColor="#94A3B8"
                                value={time}
                                onChangeText={setTime}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Poster Image URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://..."
                            placeholderTextColor="#94A3B8"
                            value={image}
                            onChangeText={setImage}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Event Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Provide context regarding guidelines, timeline, schedules..."
                            placeholderTextColor="#94A3B8"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Publish Event</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = ({ colors, radius, spacing, typography }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
            paddingTop: spacing.xs,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
            backgroundColor: colors.surface,
        },
        backButton: {
            marginRight: spacing.md,
        },
        headerTitle: {
            ...typography.h3,
            color: colors.text,
            fontWeight: '700',
        },
        scrollContent: {
            padding: spacing.lg,
            paddingBottom: 40,
        },
        sectionTitle: {
            ...typography.h2,
            color: colors.text,
            marginBottom: spacing.lg,
        },
        inputGroup: {
            marginBottom: spacing.lg,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.xs,
        },
        input: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            height: 48,
            fontSize: 16,
            color: colors.text,
        },
        row: {
            flexDirection: 'row',
            gap: spacing.md,
        },
        textArea: {
            height: 100,
            paddingTop: spacing.sm,
            textAlignVertical: 'top',
        },
        submitButton: {
            backgroundColor: colors.primary || '#0052CC',
            borderRadius: radius.xl,
            height: 52,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacing.xl,
            elevation: 2,
        },
        submitButtonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: '700',
        },
    });