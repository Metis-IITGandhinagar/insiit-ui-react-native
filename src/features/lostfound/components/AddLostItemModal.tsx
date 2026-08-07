import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/core/theme";
import { resolveBackendAsset } from "@/core/api/apiClient";
import { fetchImageAsBase64 } from "@/shared/media/pickImages";
import { LostFoundEntry, LostFoundRequest } from "../services/lostFoundTypes";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (request: LostFoundRequest) => Promise<void>;
    // When set, the modal edits this entry instead of creating a new one.
    editingEntry?: LostFoundEntry | null;
}

const AddLostItemModal = ({
    visible,
    onClose,
    onSubmit,
    editingEntry,
}: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const isEditing = !!editingEntry;

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imagePreviewUri, setImagePreviewUri] = useState<string | null>(
        null
    );
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            setItemName(editingEntry?.item_name ?? "");
            setDescription(editingEntry?.description ?? "");
            setImageBase64(null);
            // img_urls are relative paths; resolve so the preview loads and so an
            // unchanged photo can be fetched back on submit.
            setImagePreviewUri(resolveBackendAsset(editingEntry?.img_urls?.[0]) ?? null);
        }
    }, [visible, editingEntry]);

    const resetAndClose = () => {
        setItemName("");
        setDescription("");
        setImageBase64(null);
        setImagePreviewUri(null);
        onClose();
    };

    const handlePickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission needed",
                "Please allow photo library access to attach an image."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // MediaTypeOptions is deprecated in SDK 54+; the array form is current.
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled && result.assets?.[0]) {
            const asset = result.assets[0];
            setImagePreviewUri(asset.uri);

            if (asset.base64) {
                const mime = asset.mimeType ?? "image/jpeg";
                setImageBase64(`data:${mime};base64,${asset.base64}`);
            }
        }
    };

    const handleRemoveImage = () => {
        setImageBase64(null);
        setImagePreviewUri(null);
    };

    const handleSubmit = async () => {
        if (!itemName.trim() || !description.trim()) {
            Alert.alert(
                "Missing details",
                "Please fill in both the item name and description."
            );
            return;
        }

        // On create, an image is required by convention (cards look for img_urls[0]).
        if (!isEditing && !imageBase64) {
            Alert.alert(
                "Add a photo",
                "Please attach a photo of the item."
            );
            return;
        }

        try {
            setSubmitting(true);

            // The edit endpoint REPLACES img_urls with whatever base64 it receives, so
            // an unchanged photo has to be fetched back and resent or it gets wiped.
            let images: string[] = imageBase64 ? [imageBase64] : [];
            if (!imageBase64 && imagePreviewUri) {
                images = [await fetchImageAsBase64(imagePreviewUri)];
            }

            await onSubmit({
                item_name: itemName.trim(),
                description: description.trim(),
                base64_images: images,
            });
            resetAndClose();
        } catch (e: any) {
            console.error("Lost & found submit failed:", e);
            Alert.alert(
                "Error",
                e?.message ??
                    `Couldn't ${isEditing ? "update" : "submit"} the report. Please try again.`
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={resetAndClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={resetAndClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modal}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={resetAndClose}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color={colors.text}
                            />
                        </TouchableOpacity>

                        <ScrollView contentContainerStyle={styles.body}>
                            <Text style={styles.title}>
                                {isEditing
                                    ? "Edit Report"
                                    : "Report Lost Item"}
                            </Text>

                            <Text style={styles.label}>Photo</Text>

                            {imagePreviewUri ? (
                                <View style={styles.imageWrap}>
                                    <Image
                                        source={{ uri: imagePreviewUri }}
                                        style={styles.imagePreview}
                                    />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={handleRemoveImage}
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={24}
                                            color="#FFF"
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.imagePickerButton}
                                    onPress={handlePickImage}
                                >
                                    <Ionicons
                                        name="camera-outline"
                                        size={28}
                                        color={colors.textSecondary}
                                    />
                                    <Text style={styles.imagePickerText}>
                                        Add a photo
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <Text style={styles.label}>Item Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Black water bottle"
                                placeholderTextColor={colors.textSecondary}
                                value={itemName}
                                onChangeText={setItemName}
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.textArea,
                                ]}
                                placeholder="Describe the item, where you last saw it, any identifying marks..."
                                placeholderTextColor={colors.textSecondary}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.primaryButtonText}>
                                        {isEditing
                                            ? "Save Changes"
                                            : "Submit Report"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default AddLostItemModal;

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
            backgroundColor: colors.background,
        },

        body: {
            padding: spacing.lg,
            paddingTop: spacing.xl + spacing.md,
        },

        title: {
            ...typography.h2,
            color: colors.text,
            marginBottom: spacing.lg,
        },

        label: {
            ...typography.body,
            fontWeight: "600",
            color: colors.text,
            marginBottom: spacing.sm,
        },

        imagePickerButton: {
            height: 160,
            borderRadius: radius.md,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: colors.border,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.lg,
        },

        imagePickerText: {
            marginTop: spacing.sm,
            color: colors.textSecondary,
            ...typography.body,
        },

        imageWrap: {
            position: "relative",
            marginBottom: spacing.lg,
        },

        imagePreview: {
            width: "100%",
            height: 200,
            borderRadius: radius.md,
            backgroundColor: colors.border,
        },

        removeImageButton: {
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 12,
        },

        input: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.md,
            padding: spacing.md,
            color: colors.text,
            ...typography.body,
            marginBottom: spacing.lg,
        },

        textArea: {
            minHeight: 100,
            textAlignVertical: "top",
        },

        primaryButton: {
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: radius.round,
            alignItems: "center",
            justifyContent: "center",
            marginTop: spacing.sm,
        },

        primaryButtonText: {
            color: "#FFF",
            fontWeight: "700",
        },
    });