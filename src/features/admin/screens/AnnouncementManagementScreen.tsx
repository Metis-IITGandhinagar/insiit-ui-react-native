import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { Plus, Trash2, Edit2, RefreshCw, Megaphone, X, ImagePlus } from 'lucide-react-native';
import { pickImagesAsBase64 } from '@/shared/media/pickImages';
import { useTheme } from '@core/theme';
import { useAuth } from '@core/auth/useAuth';
import { Card } from '@shared/components/Card';
import { PermissionGate } from '../components/PermissionGate';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { adminService } from '../services/adminService';
import { apiClient } from '@core/api/apiClient';

export interface Announcement {
    id: string;
    title: string;
    description: string;
    /** Unix seconds — the backend serializes this with `time::serde::timestamp`. */
    added_on_timestamp: number;
    added_by_email: string;
    img_url: string;
}

export const AnnouncementManagementScreen: React.FC = () => {
    const { colors, spacing, typography, radius } = useTheme();
    const { user } = useAuth();
    const { permissions, canManageAnnouncements } = useAdminPermissions();

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [formTitle, setFormTitle] = useState<string>('');
    const [formContent, setFormContent] = useState<string>('');
    const [formImage, setFormImage] = useState<string | null>(null);

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Announcement[]>('/announcements');
            setAnnouncements(response.data);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch announcements.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleOpenAddModal = useCallback(() => {
        setEditingAnnouncement(null);
        setFormTitle('');
        setFormContent('');
        setFormImage(null);
        setIsModalOpen(true);
    }, []);

    const handleOpenEditModal = useCallback((announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setFormTitle(announcement.title);
        setFormContent(announcement.description);
        setFormImage(null);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setEditingAnnouncement(null);
        setFormTitle('');
        setFormContent('');
        setFormImage(null);
    }, [isSubmitting]);

    // Data URI: previewed directly, and sent as img_base64 (the backend strips the
    // prefix before decoding).
    const handlePickImage = useCallback(async () => {
        try {
            const [picked] = await pickImagesAsBase64(1);
            if (picked) setFormImage(picked);
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Could not open your photo library.');
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formTitle.trim() || !formContent.trim()) {
            Alert.alert('Validation Error', 'Title and Content are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingAnnouncement) {
                // The backend's AnnouncementRequest requires `description`; `content`
                // was silently dropped and the request rejected as incomplete.
                await apiClient.put(`/announcements/${editingAnnouncement.id}`, {
                    title: formTitle.trim(),
                    description: formContent.trim(),
                    // COALESCE server-side: omitting it keeps the existing image.
                    img_base64: formImage ?? null,
                });
            } else {
                await apiClient.post('/announcements', {
                    title: formTitle.trim(),
                    description: formContent.trim(),
                    img_base64: formImage ?? null,
                });
            }
            handleCloseModal();
            await fetchAnnouncements();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to save announcement.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formTitle, formContent, formImage, editingAnnouncement, handleCloseModal, fetchAnnouncements]);

    const handleDelete = useCallback((id: string) => {
        Alert.alert(
            'Delete Announcement',
            'Are you sure you want to delete this announcement?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(id);
                            await adminService.deleteAnnouncement(id);
                            await fetchAnnouncements();
                        } catch (err: any) {
                            Alert.alert('Error', 'Failed to delete announcement.');
                        } finally {
                            setIsDeleting(null);
                        }
                    },
                },
            ]
        );
    }, [fetchAnnouncements]);

    const renderAnnouncementItem = useCallback(({ item }: { item: Announcement }) => {
        const isAuthor = user?.email === item.added_by_email;

        return (
            <Card variant="surface" style={styles.cardOverride}>
                <View style={styles.announcementHeader}>
                    <Megaphone size={20} color={colors.primary} style={styles.headerIcon} />
                    <Text
                        style={[
                            styles.announcementTitle,
                            {
                                color: colors.text,
                                fontSize: typography.h3?.fontSize || 18,
                                fontWeight: typography.h3?.fontWeight || '700',
                            },
                        ]}
                    >
                        {item.title}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.announcementContent,
                        {
                            color: colors.textSecondary,
                            fontSize: typography.h2?.fontSize || 14,
                            marginVertical: spacing.sm,
                        },
                    ]}
                >
                    {item.description}
                </Text>

                {isAuthor && (
                    <View style={[styles.actionRow, { borderTopColor: colors.border || '#E5E7EB' }]}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.surface }]}
                            onPress={() => handleOpenEditModal(item)}
                            activeOpacity={0.7}
                        >
                            <Edit2 size={16} color={colors.primary} />
                            <Text
                                style={[
                                    styles.actionText,
                                    {
                                        color: colors.primary,
                                        fontSize: typography.caption?.fontSize || 12,
                                        fontWeight: '600',
                                    },
                                ]}
                            >
                                Edit
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.surface }]}
                            onPress={() => handleDelete(item.id)}
                            disabled={isDeleting === item.id}
                            activeOpacity={0.7}
                        >
                            {isDeleting === item.id ? (
                                <ActivityIndicator size="small" color={colors.danger || '#EF4444'} />
                            ) : (
                                <>
                                    <Trash2 size={16} color={colors.danger || '#EF4444'} />
                                    <Text
                                        style={[
                                            styles.actionText,
                                            {
                                                color: colors.danger || '#EF4444',
                                                fontSize: typography.caption?.fontSize || 12,
                                                fontWeight: '600',
                                            },
                                        ]}
                                    >
                                        Delete
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </Card>
        );
    }, [colors, typography, spacing, user, handleOpenEditModal, handleDelete, isDeleting]);

    return (
        <PermissionGate hasPermission={canManageAnnouncements}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {isLoading && !announcements.length ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error && !announcements.length ? (
                    <View style={[styles.centered, { padding: spacing.xl }]}>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: typography.h3?.fontSize || 20,
                                fontWeight: '700',
                                marginBottom: spacing.xs,
                                textAlign: 'center',
                            }}
                        >
                            Failed to Load
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
                            onPress={fetchAnnouncements}
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
                        data={announcements}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAnnouncementItem}
                        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
                        refreshing={isLoading}
                        onRefresh={fetchAnnouncements}
                        ListEmptyComponent={
                            <View style={[styles.centered, { paddingVertical: spacing.xxl }]}>
                                <Text style={{ color: colors.textSecondary, fontSize: typography.h1?.fontSize || 16 }}>
                                    No announcements broadcasted yet.
                                </Text>
                            </View>
                        }
                    />
                )}

                {permissions?.post_announcement && (
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

                <Modal
                    visible={isModalOpen}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={handleCloseModal}
                >
                    <KeyboardAvoidingView
                        style={[styles.modalContainer, { backgroundColor: colors.background }]}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border || '#EEE', padding: spacing.lg }]}>
                            <TouchableOpacity onPress={handleCloseModal} disabled={isSubmitting}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[{ color: colors.text, fontSize: typography.h3?.fontSize || 18, fontWeight: '700' }]}>
                                {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                            </Text>
                            <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                                        Save
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                        marginBottom: spacing.md,
                                    },
                                ]}
                                placeholder="Announcement Title"
                                placeholderTextColor={colors.textSecondary || '#999'}
                                value={formTitle}
                                onChangeText={setFormTitle}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.textArea,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                    },
                                ]}
                                placeholder="Write announcement details..."
                                placeholderTextColor={colors.textSecondary || '#999'}
                                multiline
                                numberOfLines={6}
                                value={formContent}
                                onChangeText={setFormContent}
                            />

                            {formImage ? (
                                <View style={styles.imageWrap}>
                                    <Image
                                        source={{ uri: formImage }}
                                        style={[styles.imagePreview, { borderRadius: radius.md }]}
                                    />
                                    <TouchableOpacity
                                        style={styles.imageRemove}
                                        onPress={() => setFormImage(null)}
                                    >
                                        <X size={14} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.imagePicker, { borderColor: colors.border, borderRadius: radius.md }]}
                                    onPress={handlePickImage}
                                >
                                    <ImagePlus size={20} color={colors.textSecondary} />
                                    <Text style={[styles.imagePickerText, { color: colors.textSecondary }]}>
                                        {editingAnnouncement ? 'Replace image' : 'Add an image (optional)'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </PermissionGate>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 12,
    },
    imagePickerText: {
        fontSize: 14,
    },
    imageWrap: {
        marginTop: 12,
    },
    imagePreview: {
        width: '100%',
        height: 180,
    },
    imageRemove: {
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
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        flexGrow: 1,
    },
    cardOverride: {
        marginBottom: 16,
    },
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    announcementTitle: {
        flex: 1,
    },
    announcementContent: {
        lineHeight: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 8,
        marginTop: 8,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionText: {
        marginLeft: 4,
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
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    input: {
        fontSize: 16,
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
    },
});