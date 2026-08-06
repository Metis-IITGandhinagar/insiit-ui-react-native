import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImagePlus, Package2, Pencil, Trash2, X } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { useAuth } from '@/core/auth/useAuth';
import { formatBackendDateTime } from '@/core/api/backendTime';
import { resolveBackendAsset } from '@/core/api/apiClient';
import { fetchImageAsBase64, pickImagesAsBase64 } from '@/shared/media/pickImages';
import { useLostFound } from '../hooks/useLostFound';
import { LostFoundEntry, LostFoundStatus, lostFoundService } from '../services/lostFoundService';

const STATUS_LABELS: Record<LostFoundStatus, string> = {
    lost: 'Lost',
    found: 'Found',
    claimed_to_be_found: 'Claim pending',
};

export default function LostFoundScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const { user } = useAuth();
    const { entries, loading, error, refresh } = useLostFound();

    // One sheet serves three flows: reporting, editing your own report, and claiming
    // someone else's item.
    const [sheet, setSheet] = useState<
        | { mode: 'report' }
        | { mode: 'edit'; entry: LostFoundEntry }
        | { mode: 'claim'; entry: LostFoundEntry }
        | null
    >(null);
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoadingImages, setLoadingImages] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);

    const resetSheet = useCallback(() => {
        setSheet(null);
        setItemName('');
        setDescription('');
        setImages([]);
    }, []);

    const closeSheet = useCallback(() => {
        if (isSubmitting) return;
        resetSheet();
    }, [isSubmitting, resetSheet]);

    const handleAttachImages = useCallback(async () => {
        try {
            const picked = await pickImagesAsBase64(4 - images.length);
            if (picked.length) setImages((prev) => [...prev, ...picked].slice(0, 4));
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Could not open your photo library.');
        }
    }, [images.length]);

    const handleSubmitSheet = useCallback(async () => {
        if (!sheet) return;

        if (sheet.mode === 'claim') {
            if (!description.trim()) {
                Alert.alert('Missing details', 'Tell the owner where you found it.');
                return;
            }
            setSubmitting(true);
            try {
                await lostFoundService.claimFound(sheet.entry, description.trim());
                resetSheet();
                await refresh();
            } catch (err: any) {
                Alert.alert('Error', err?.message || 'Could not submit your claim.');
            } finally {
                setSubmitting(false);
            }
            return;
        }

        if (!itemName.trim() || !description.trim()) {
            Alert.alert('Missing details', 'Item name and description are both required.');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                item_name: itemName.trim(),
                description: description.trim(),
                base64_images: images,
            };
            if (sheet.mode === 'edit') {
                await lostFoundService.edit(sheet.entry.id, payload);
            } else {
                await lostFoundService.report(payload);
            }
            resetSheet();
            await refresh();
        } catch (err: any) {
            Alert.alert(
                'Error',
                err?.message ||
                    (sheet.mode === 'edit'
                        ? 'Could not update this item.'
                        : 'Could not report this item.')
            );
        } finally {
            setSubmitting(false);
        }
    }, [sheet, itemName, description, images, refresh, resetSheet]);

    const handleEdit = useCallback(async (entry: LostFoundEntry) => {
        setItemName(entry.item_name);
        setDescription(entry.description);
        setImages([]);
        setSheet({ mode: 'edit', entry });

        // The edit endpoint replaces img_urls with whatever base64 it receives, so the
        // existing photos have to be pulled back down to survive the save.
        if (entry.img_urls.length === 0) return;
        setLoadingImages(true);
        try {
            const existing = await Promise.all(
                entry.img_urls.map((url) => fetchImageAsBase64(resolveBackendAsset(url)!))
            );
            setImages(existing);
        } catch {
            Alert.alert(
                'Existing photos unavailable',
                'Those photos could not be loaded. Saving now would remove them from the report.'
            );
        } finally {
            setLoadingImages(false);
        }
    }, []);

    const handleDelete = useCallback((entry: LostFoundEntry) => {
        Alert.alert('Delete report', `Remove "${entry.item_name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setBusyId(entry.id);
                    try {
                        await lostFoundService.remove(entry.id);
                        await refresh();
                    } catch (err: any) {
                        Alert.alert('Error', err?.message || 'Could not delete this item.');
                    } finally {
                        setBusyId(null);
                    }
                },
            },
        ]);
    }, [refresh]);

    const handleMarkFound = useCallback(async (entry: LostFoundEntry) => {
        setBusyId(entry.id);
        try {
            await lostFoundService.markFound(entry);
            await refresh();
        } catch (err: any) {
            Alert.alert('Error', 'Only the person who reported this item can mark it found.');
        } finally {
            setBusyId(null);
        }
    }, [refresh]);

    const handleClaim = useCallback((entry: LostFoundEntry) => {
        setDescription('');
        setImages([]);
        setSheet({ mode: 'claim', entry });
    }, []);

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={["left", "right"]}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
                    }
                >
                    <View style={styles.heroCard}>
                        <Package2 size={32} color={colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={styles.heroTitle}>Lost something?</Text>
                        <Text style={styles.heroSubtitle}>
                            Report lost items or browse items found around campus.
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.actionButton} onPress={() => setSheet({ mode: 'report' })}>
                        <Text style={styles.actionButtonText}>Report an Item</Text>
                    </TouchableOpacity>

                    {loading && entries.length === 0 ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.centered}>
                            <Text style={styles.errorText}>{error}</Text>
                            <Text style={styles.emptyHint}>Pull down to try again.</Text>
                        </View>
                    ) : entries.length === 0 ? (
                        <View style={styles.centered}>
                            <Text style={styles.emptyTitle}>Nothing reported yet</Text>
                            <Text style={styles.emptyHint}>Be the first to report a lost item.</Text>
                        </View>
                    ) : (
                        entries.map((entry) => {
                            const isOwner = user?.email === entry.added_by_email;
                            const isBusy = busyId === entry.id;

                            return (
                                <View key={entry.id} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>
                                            {entry.item_name}
                                        </Text>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>
                                                {STATUS_LABELS[entry.status] ?? entry.status}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.cardSubtitle}>{entry.description}</Text>

                                    {entry.img_urls.length > 0 && (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={styles.thumbRow}
                                        >
                                            {entry.img_urls.map((url) => (
                                                <Image
                                                    key={url}
                                                    source={{ uri: resolveBackendAsset(url) }}
                                                    style={styles.thumb}
                                                />
                                            ))}
                                        </ScrollView>
                                    )}

                                    <Text style={styles.metaText}>
                                        {entry.added_by_email}
                                        {!!formatBackendDateTime(entry.added_on_timestamp) &&
                                            ` · ${formatBackendDateTime(entry.added_on_timestamp)}`}
                                    </Text>

                                    {entry.found_claims.length > 0 && (
                                        <Text style={styles.claimCount}>
                                            {entry.found_claims.length} claim
                                            {entry.found_claims.length === 1 ? '' : 's'}
                                            {isOwner && `: ${entry.found_claims.map(c => c.claimed_by_email).join(', ')}`}
                                        </Text>
                                    )}

                                    <View style={styles.cardActions}>
                                        {entry.status !== 'found' && (
                                            isOwner ? (
                                                <TouchableOpacity
                                                    style={styles.smallButton}
                                                    disabled={isBusy}
                                                    onPress={() => handleMarkFound(entry)}
                                                >
                                                    <Text style={styles.smallButtonText}>
                                                        {isBusy ? 'Working…' : 'Mark as found'}
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    style={styles.smallButtonOutline}
                                                    disabled={isBusy}
                                                    onPress={() => handleClaim(entry)}
                                                >
                                                    <Text style={styles.smallButtonOutlineText}>
                                                        {isBusy ? 'Working…' : 'I found this'}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        )}

                                        {isOwner && (
                                            <>
                                                <TouchableOpacity
                                                    style={styles.iconButton}
                                                    disabled={isBusy}
                                                    onPress={() => handleEdit(entry)}
                                                    hitSlop={6}
                                                >
                                                    <Pencil size={16} color={colors.textSecondary} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.iconButton}
                                                    disabled={isBusy}
                                                    onPress={() => handleDelete(entry)}
                                                    hitSlop={6}
                                                >
                                                    <Trash2 size={16} color={colors.danger} />
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </SafeAreaView>

            <Modal visible={sheet !== null} animationType="slide" transparent onRequestClose={closeSheet}>
                <KeyboardAvoidingView
                    style={styles.modalBackdrop}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {sheet?.mode === 'claim'
                                    ? `Found "${sheet.entry.item_name}"?`
                                    : sheet?.mode === 'edit'
                                        ? 'Edit report'
                                        : 'Report an item'}
                            </Text>
                            <TouchableOpacity onPress={closeSheet} hitSlop={8}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {sheet?.mode !== 'claim' && (
                            <>
                                <Text style={styles.label}>Item</Text>
                                <TextInput
                                    style={styles.input}
                                    value={itemName}
                                    onChangeText={setItemName}
                                    placeholder="Black wallet"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </>
                        )}

                        <Text style={styles.label}>
                            {sheet?.mode === 'claim' ? 'Where did you find it?' : 'Description'}
                        </Text>
                        <TextInput
                            style={[styles.input, styles.inputMultiline]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder={
                                sheet?.mode === 'claim'
                                    ? 'Left it at the library front desk…'
                                    : 'Where you lost it, distinguishing details…'
                            }
                            placeholderTextColor={colors.textSecondary}
                            multiline
                        />

                        {sheet?.mode !== 'claim' && (
                            <>
                                <Text style={styles.label}>Photos (optional)</Text>
                                <View style={styles.thumbRow}>
                                    {images.map((uri, index) => (
                                        <TouchableOpacity
                                            key={`${uri.slice(-16)}-${index}`}
                                            onPress={() =>
                                                setImages((prev) => prev.filter((_, i) => i !== index))
                                            }
                                        >
                                            <Image source={{ uri }} style={styles.thumb} />
                                            <View style={styles.thumbRemove}>
                                                <X size={12} color="#FFFFFF" />
                                            </View>
                                        </TouchableOpacity>
                                    ))}

                                    {images.length < 4 && (
                                        <TouchableOpacity
                                            style={styles.thumbAdd}
                                            onPress={handleAttachImages}
                                        >
                                            <ImagePlus size={20} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </>
                        )}

                        {sheet?.mode === 'edit' && (
                            <Text style={styles.hint}>
                                {isLoadingImages
                                    ? 'Loading the current photos…'
                                    : 'Saving replaces every photo on this report — remove any you no longer want.'}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                (isSubmitting || isLoadingImages) && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmitSheet}
                            disabled={isSubmitting || isLoadingImages}
                        >
                            <Text style={styles.actionButtonText}>
                                {isSubmitting
                                    ? 'Submitting…'
                                    : sheet?.mode === 'claim'
                                        ? 'Notify owner'
                                        : sheet?.mode === 'edit'
                                            ? 'Save changes'
                                            : 'Report'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const getStyles = ({ colors, spacing, radius }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 120,
        gap: spacing.md,
    },
    heroCard: {
        backgroundColor: colors.primary + '12',
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    heroSubtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    centered: {
        paddingVertical: spacing.xxl,
        alignItems: 'center',
        gap: spacing.xs,
    },
    errorText: {
        color: colors.danger,
        fontWeight: '600',
        fontSize: 15,
    },
    emptyTitle: {
        color: colors.text,
        fontWeight: '700',
        fontSize: 15,
    },
    emptyHint: {
        color: colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        flexShrink: 1,
    },
    badge: {
        backgroundColor: colors.primary + '12',
        borderRadius: radius.round,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: spacing.sm,
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    claimCount: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    iconButton: {
        width: 34,
        height: 34,
        borderRadius: radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    thumbRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    thumb: {
        width: 64,
        height: 64,
        borderRadius: radius.md,
        backgroundColor: colors.background,
    },
    thumbRemove: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbAdd: {
        width: 64,
        height: 64,
        borderRadius: radius.md,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hint: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: spacing.sm,
    },
    smallButton: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
    },
    smallButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
    },
    smallButtonOutline: {
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    smallButtonOutlineText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.xs,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text,
        marginTop: spacing.sm,
        marginBottom: 6,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 15,
    },
    inputMultiline: {
        minHeight: 90,
        textAlignVertical: 'top',
    },
});
