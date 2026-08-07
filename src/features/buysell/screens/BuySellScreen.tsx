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
import { ImagePlus, Pencil, ShoppingBag, Trash2, X } from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { useAuth } from '@/core/auth/useAuth';
import { useAuthGate } from '@/core/auth/useAuthGate';
import { formatBackendDateTime } from '@/core/api/backendTime';
import { resolveBackendAsset } from '@/core/api/apiClient';
import { fetchImageAsBase64, pickImagesAsBase64 } from '@/shared/media/pickImages';
import { useBuySell } from '../hooks/useBuySell';
import { BuySellEntry, buySellService } from '../services/buySellService';

export default function BuySellScreen() {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const { user } = useAuth();
    const { ensureSignedIn } = useAuthGate();
    const { entries, loading, error, refresh } = useBuySell();

    // One sheet serves three flows: listing an item, editing your own listing, and
    // bidding on someone else's.
    const [sheet, setSheet] = useState<
        | { mode: 'sell' }
        | { mode: 'edit'; entry: BuySellEntry }
        | { mode: 'bid'; entry: BuySellEntry }
        | null
    >(null);
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoadingImages, setLoadingImages] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);

    const resetSheet = useCallback(() => {
        setSheet(null);
        setItemName('');
        setDescription('');
        setAmount('');
        setImages([]);
    }, []);

    const handleAttachImages = useCallback(async () => {
        try {
            const picked = await pickImagesAsBase64(4 - images.length);
            if (picked.length) setImages((prev) => [...prev, ...picked].slice(0, 4));
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Could not open your photo library.');
        }
    }, [images.length]);

    const closeSheet = useCallback(() => {
        if (isSubmitting) return;
        resetSheet();
    }, [isSubmitting, resetSheet]);

    const handleSubmitSheet = useCallback(async () => {
        if (!sheet) return;

        if (sheet.mode === 'bid') {
            const parsed = Number(amount);
            if (!amount.trim() || !isFinite(parsed) || parsed <= 0) {
                Alert.alert('Invalid bid', 'Enter a bid amount greater than zero.');
                return;
            }
            setSubmitting(true);
            try {
                await buySellService.placeBid(sheet.entry, parsed, description.trim());
                resetSheet();
                await refresh();
            } catch (err: any) {
                Alert.alert('Error', err?.message || 'Could not place your bid.');
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
                await buySellService.edit(sheet.entry.id, payload);
            } else {
                await buySellService.list(payload);
            }
            resetSheet();
            await refresh();
        } catch (err: any) {
            Alert.alert(
                'Error',
                err?.message ||
                    (sheet.mode === 'edit'
                        ? 'Could not update your listing.'
                        : 'Could not create your listing.')
            );
        } finally {
            setSubmitting(false);
        }
    }, [sheet, itemName, description, amount, images, refresh, resetSheet]);

    const handleEdit = useCallback(async (entry: BuySellEntry) => {
        setItemName(entry.item_name);
        setDescription(entry.description);
        setAmount('');
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
        } catch (err: any) {
            console.error('Failed to load existing listing photos:', err);
            Alert.alert(
                'Existing photos unavailable',
                `${err?.message ?? 'Those photos could not be loaded.'}\n\nSaving now would remove them from the listing.`
            );
        } finally {
            setLoadingImages(false);
        }
    }, []);

    const handleDelete = useCallback((entry: BuySellEntry) => {
        Alert.alert('Delete listing', `Remove "${entry.item_name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    setBusyId(entry.id);
                    try {
                        await buySellService.remove(entry.id);
                        await refresh();
                    } catch (err: any) {
                        Alert.alert('Error', err?.message || 'Could not delete this listing.');
                    } finally {
                        setBusyId(null);
                    }
                },
            },
        ]);
    }, [refresh]);

    const handleMarkSold = useCallback(async (entry: BuySellEntry) => {
        setBusyId(entry.id);
        try {
            await buySellService.markSold(entry);
            await refresh();
        } catch {
            Alert.alert('Error', 'Only the seller can mark this item sold.');
        } finally {
            setBusyId(null);
        }
    }, [refresh]);

    const highestBid = (entry: BuySellEntry): number | null =>
        entry.bids.length === 0
            ? null
            : Math.max(...entry.bids.map((bid) => bid.bid_amount_in_rs));

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
                        // Only spin here for a pull-to-refresh; the first load is already
                        // covered by the centred indicator below.
                        <RefreshControl
                            refreshing={loading && entries.length > 0}
                            onRefresh={refresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <View style={styles.heroCard}>
                        <ShoppingBag size={32} color={colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={styles.heroTitle}>Campus Marketplace</Text>
                        <Text style={styles.heroSubtitle}>
                            Buy and sell items within the campus community. Books, gadgets, furniture, and more.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            if (!ensureSignedIn('list an item for sale')) return;
                            setSheet({ mode: 'sell' });
                        }}
                    >
                        <Text style={styles.actionButtonText}>Sell an Item</Text>
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
                            <Text style={styles.emptyTitle}>Nothing listed yet</Text>
                            <Text style={styles.emptyHint}>Be the first to list something.</Text>
                        </View>
                    ) : (
                        entries.map((entry) => {
                            const isSeller = user?.email === entry.added_by_email;
                            const isBusy = busyId === entry.id;
                            const isSold = entry.status === 'sold';
                            const top = highestBid(entry);

                            return (
                                <View key={entry.id} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>
                                            {entry.item_name}
                                        </Text>
                                        <View style={[styles.badge, isSold && styles.badgeMuted]}>
                                            <Text style={[styles.badgeText, isSold && styles.badgeTextMuted]}>
                                                {isSold ? 'Sold' : 'Selling'}
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

                                    {top !== null && (
                                        <Text style={styles.bidSummary}>
                                            {entry.bids.length} bid{entry.bids.length === 1 ? '' : 's'} · highest ₹{top}
                                        </Text>
                                    )}

                                    <View style={styles.cardActions}>
                                        {!isSold && (
                                            isSeller ? (
                                                <TouchableOpacity
                                                    style={styles.smallButton}
                                                    disabled={isBusy}
                                                    onPress={() => handleMarkSold(entry)}
                                                >
                                                    <Text style={styles.smallButtonText}>
                                                        {isBusy ? 'Working…' : 'Mark as sold'}
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    style={styles.smallButtonOutline}
                                                    onPress={() => {
                                                        if (!ensureSignedIn('place a bid')) return;
                                                        setAmount('');
                                                        setDescription('');
                                                        setImages([]);
                                                        setSheet({ mode: 'bid', entry });
                                                    }}
                                                >
                                                    <Text style={styles.smallButtonOutlineText}>Place a bid</Text>
                                                </TouchableOpacity>
                                            )
                                        )}

                                        {isSeller && (
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
                                {sheet?.mode === 'bid'
                                    ? `Bid on ${sheet.entry.item_name}`
                                    : sheet?.mode === 'edit'
                                        ? 'Edit listing'
                                        : 'List an item'}
                            </Text>
                            <TouchableOpacity onPress={closeSheet} hitSlop={8}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {sheet?.mode !== 'bid' ? (
                            <>
                                <Text style={styles.label}>Item</Text>
                                <TextInput
                                    style={styles.input}
                                    value={itemName}
                                    onChangeText={setItemName}
                                    placeholder="Study desk"
                                    placeholderTextColor={colors.textSecondary}
                                />

                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.inputMultiline]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Condition, age, asking price…"
                                    placeholderTextColor={colors.textSecondary}
                                    multiline
                                />

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

                                {sheet?.mode === 'edit' && (
                                    <Text style={styles.hint}>
                                        {isLoadingImages
                                            ? 'Loading the current photos…'
                                            : 'Saving replaces every photo on this listing — remove any you no longer want.'}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Your bid (₹)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholder="1200"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                />

                                <Text style={styles.label}>Remarks (optional)</Text>
                                <TextInput
                                    style={[styles.input, styles.inputMultiline]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Can collect this weekend…"
                                    placeholderTextColor={colors.textSecondary}
                                    multiline
                                />
                            </>
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
                                    : sheet?.mode === 'bid'
                                        ? 'Place bid'
                                        : sheet?.mode === 'edit'
                                            ? 'Save changes'
                                            : 'List item'}
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
    badgeMuted: {
        backgroundColor: colors.border,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    badgeTextMuted: {
        color: colors.textSecondary,
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
    bidSummary: {
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
        flexShrink: 1,
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
