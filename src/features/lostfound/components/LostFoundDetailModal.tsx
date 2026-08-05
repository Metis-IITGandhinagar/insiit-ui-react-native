import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Image,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { useAuth } from "@/core/auth/useAuth";
import { LostFoundEntry } from "../services/lostFoundTypes";
import { formatRelativeDate } from "../utils/formatDate";

interface Props {
    visible: boolean;
    entry: LostFoundEntry | null;
    onClose: () => void;
    onClaimFound: (remarks: string) => Promise<void>;
    onMarkFound: () => Promise<void>;
    onEdit: () => void;
    onDelete: () => Promise<void>;
}

const STATUS_LABEL: Record<LostFoundEntry["status"], string> = {
    lost: "Lost",
    claimed_to_be_found: "Claim Pending",
    found: "Found",
};

function getStatusColor(status: LostFoundEntry["status"], colors: any) {
    switch (status) {
        case "lost":
            return colors.danger ?? "#DC2626";
        case "claimed_to_be_found":
            return colors.warning ?? "#F59E0B";
        case "found":
            return colors.success ?? "#16A34A";
        default:
            return colors.textSecondary ?? "#6B7280";
    }
}

const LostFoundDetailModal = ({
    visible,
    entry,
    onClose,
    onClaimFound,
    onMarkFound,
    onEdit,
    onDelete,
}: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    // Assumption: useAuth exposes the current Firebase user with an
    // `email` field. Adjust the accessor below if your hook's shape
    // differs (e.g. `user?.email` vs `currentUser?.email`).
    const { user } = useAuth() as { user?: { email?: string | null } };

    const [remarks, setRemarks] = useState("");
    const [submittingClaim, setSubmittingClaim] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(false);

    if (!entry) return null;

    const isOwner = !!user?.email && user.email === entry.added_by_email;
    const statusColor = getStatusColor(entry.status, colors);
    const isActive = entry.status !== "found";

    const handleClose = () => {
        setRemarks("");
        onClose();
    };

    const handleSubmitClaim = async () => {
        if (!remarks.trim()) {
            Alert.alert(
                "Add a remark",
                "Please describe where the item was found or how it can be collected."
            );
            return;
        }
        try {
            setSubmittingClaim(true);
            await onClaimFound(remarks.trim());
            setRemarks("");
        } catch (e) {
            Alert.alert("Error", "Couldn't submit your claim. Please try again.");
        } finally {
            setSubmittingClaim(false);
        }
    };

    const handleMarkFound = async () => {
        try {
            setSubmittingAction(true);
            await onMarkFound();
        } catch (e) {
            Alert.alert("Error", "Couldn't update the item. Please try again.");
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete report",
            "Are you sure you want to delete this report? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setSubmittingAction(true);
                            await onDelete();
                            handleClose();
                        } catch (e) {
                            Alert.alert(
                                "Error",
                                "Couldn't delete this report. Please try again."
                            );
                        } finally {
                            setSubmittingAction(false);
                        }
                    },
                },
            ]
        );
    };

    const image =
        entry.img_urls?.[0]
            ? entry.img_urls[0].startsWith("http")
                ? entry.img_urls[0]
                : `https://insiit-api-rust.metis-iitgn.tech/${entry.img_urls[0]}`
            : "https://placehold.co/800x500?text=Lost+%26+Found";

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={handleClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modal}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color={colors.text}
                            />
                        </TouchableOpacity>

                        <Image
                            source={{ uri:image}}
                            style={styles.image}
                        />

                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: statusColor },
                            ]}
                        >
                            <Text style={styles.statusBadgeText}>
                                {STATUS_LABEL[entry.status].toUpperCase()}
                            </Text>
                        </View>

                        <ScrollView contentContainerStyle={styles.body}>
                            <Text style={styles.title}>
                                {entry.item_name}
                            </Text>

                            {!!entry.description && (
                                <Text style={styles.description}>
                                    {entry.description}
                                </Text>
                            )}

                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color={colors.textSecondary}
                                />
                                <Text style={styles.infoText}>
                                    Reported{" "}
                                    {formatRelativeDate(
                                        entry.added_on_timestamp
                                    )}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="mail-outline"
                                    size={18}
                                    color={colors.textSecondary}
                                />
                                <Text style={styles.infoText}>
                                    {entry.added_by_email}
                                </Text>
                            </View>

                            {isOwner && (
                                <View style={styles.ownerActions}>
                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={onEdit}
                                        disabled={submittingAction}
                                    >
                                        <Ionicons
                                            name="create-outline"
                                            size={16}
                                            color={colors.text}
                                        />
                                        <Text
                                            style={
                                                styles.secondaryButtonText
                                            }
                                        >
                                            Edit
                                        </Text>
                                    </TouchableOpacity>

                                    {entry.status !== "found" && (
                                        <TouchableOpacity
                                            style={styles.secondaryButton}
                                            onPress={handleMarkFound}
                                            disabled={submittingAction}
                                        >
                                            <Ionicons
                                                name="checkmark-circle-outline"
                                                size={16}
                                                color={colors.text}
                                            />
                                            <Text
                                                style={
                                                    styles.secondaryButtonText
                                                }
                                            >
                                                Mark Recovered
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={styles.dangerButton}
                                        onPress={handleDelete}
                                        disabled={submittingAction}
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={16}
                                            color={colors.danger ?? "#DC2626"}
                                        />
                                        <Text style={styles.dangerButtonText}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>
                                Claims{" "}
                                {entry.found_claims?.length > 0 &&
                                    `(${entry.found_claims.length})`}
                            </Text>

                            {!entry.found_claims ||
                                entry.found_claims.length === 0 ? (
                                <Text style={styles.emptyClaims}>
                                    No claims submitted yet.
                                </Text>
                            ) : (
                                entry.found_claims.map((claim, index) => (
                                    <View
                                        key={`${claim.claimed_by_email}-${claim.claim_timestamp}-${index}`}
                                        style={styles.claimRow}
                                    >
                                        <View style={styles.claimHeader}>
                                            <Text style={styles.claimEmail}>
                                                {claim.claimed_by_email}
                                            </Text>
                                            <Text style={styles.claimTime}>
                                                {formatRelativeDate(
                                                    claim.claim_timestamp
                                                )}
                                            </Text>
                                        </View>
                                        <Text style={styles.claimRemarks}>
                                            {claim.remarks}
                                        </Text>
                                    </View>
                                ))
                            )}

                            {isActive && !isOwner && (
                                <>
                                    <View style={styles.divider} />

                                    <Text style={styles.sectionTitle}>
                                        Claim Found
                                    </Text>

                                    <Text style={styles.claimHint}>
                                        Let the reporter know where the
                                        item was found or how it can be
                                        collected.
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Found near SAC entrance"
                                        placeholderTextColor={
                                            colors.textSecondary
                                        }
                                        value={remarks}
                                        onChangeText={setRemarks}
                                        multiline
                                        numberOfLines={3}
                                    />

                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={handleSubmitClaim}
                                        disabled={submittingClaim}
                                    >
                                        {submittingClaim ? (
                                            <ActivityIndicator
                                                color="#FFF"
                                            />
                                        ) : (
                                            <Text
                                                style={
                                                    styles.primaryButtonText
                                                }
                                            >
                                                Submit Claim
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default LostFoundDetailModal;

const getStyles = ({
    colors,
    spacing,
    typography,
    radius,
}: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
        },

        modal: {
            width: "100%",
            maxHeight: "88%",
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            overflow: "hidden",
        },

        closeButton: {
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.surface,
        },

        image: {
            width: "100%",
            height: 240,
            backgroundColor: colors.border,
        },

        statusBadge: {
            position: "absolute",
            top: 200,
            left: spacing.lg,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 50,
        },

        statusBadgeText: {
            color: "#fff",
            fontWeight: "700",
            fontSize: 11,
        },

        body: {
            padding: spacing.lg,
        },

        title: {
            ...typography.h2,
            color: colors.text,
            marginBottom: spacing.sm,
        },

        description: {
            ...typography.body,
            color: colors.textSecondary,
            lineHeight: 22,
            marginBottom: spacing.lg,
        },

        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.sm,
        },

        infoText: {
            marginLeft: spacing.sm,
            color: colors.textSecondary,
            ...typography.body,
        },

        ownerActions: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: spacing.md,
        },

        secondaryButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: radius.round,
            marginRight: spacing.sm,
            marginBottom: spacing.sm,
        },

        secondaryButtonText: {
            marginLeft: 6,
            color: colors.text,
            fontWeight: "600",
            fontSize: 13,
        },

        dangerButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: (colors.danger ?? "#DC2626") + "18",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: radius.round,
            marginBottom: spacing.sm,
        },

        dangerButtonText: {
            marginLeft: 6,
            color: colors.danger ?? "#DC2626",
            fontWeight: "600",
            fontSize: 13,
        },

        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: spacing.lg,
        },

        sectionTitle: {
            ...typography.h3,
            color: colors.text,
            marginBottom: spacing.md,
        },

        emptyClaims: {
            ...typography.body,
            color: colors.textSecondary,
            fontStyle: "italic",
        },

        claimRow: {
            paddingVertical: spacing.md,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },

        claimHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
        },

        claimEmail: {
            ...typography.body,
            fontWeight: "600",
            color: colors.text,
            flex: 1,
            marginRight: spacing.sm,
        },

        claimTime: {
            fontSize: 12,
            color: colors.textSecondary,
        },

        claimRemarks: {
            ...typography.body,
            color: colors.textSecondary,
        },

        claimHint: {
            ...typography.body,
            color: colors.textSecondary,
            marginBottom: spacing.md,
        },

        input: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.md,
            color: colors.text,
            ...typography.body,
            textAlignVertical: "top",
            minHeight: 80,
            marginBottom: spacing.md,
        },

        primaryButton: {
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: radius.round,
            alignItems: "center",
            justifyContent: "center",
        },

        primaryButtonText: {
            color: "#FFF",
            fontWeight: "700",
        },
    });