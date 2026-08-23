import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { resolveBackendAsset } from "@/core/api/apiClient";
import { Outlet } from "../services/outletTypes";

interface Props {
    visible: boolean;
    outlet: Outlet | null;
    onClose: () => void;
}

const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

const OutletDetailModal = ({
    visible,
    outlet,
    onClose,
}: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    if (!outlet) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Backdrop press listener isolated as absolute sibling */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                {/* Modal Container */}
                <View style={styles.modal}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name="close"
                            size={24}
                            color={colors.text}
                        />
                    </TouchableOpacity>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.body}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        overScrollMode="never"
                    >
                        <Image
                            source={{
                                uri:
                                    resolveBackendAsset(outlet.image_url) ||
                                    "https://placehold.co/800x500?text=Outlet",
                            }}
                            style={styles.image}
                        />

                        <View style={styles.contentWrap}>
                            <Text style={styles.title}>
                                {outlet.name}
                            </Text>

                            {!!outlet.description && (
                                <Text style={styles.description}>
                                    {outlet.description}
                                </Text>
                            )}

                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="location-outline"
                                    size={18}
                                    color={colors.textSecondary}
                                />
                                <Text style={styles.infoText}>
                                    {outlet.landmark || "Campus"}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons
                                    name="time-outline"
                                    size={18}
                                    color={colors.textSecondary}
                                />
                                <Text style={styles.infoText}>
                                    {formatTime(outlet.open_time)} -{" "}
                                    {formatTime(outlet.close_time)}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>
                                Menu
                            </Text>

                            {outlet.menu.map((item) => (
                                <View
                                    key={item.name}
                                    style={styles.menuRow}
                                >
                                    <Text style={styles.menuName}>
                                        {item.name}
                                    </Text>

                                    <Text style={styles.price}>
                                        ₹{item.price}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default OutletDetailModal;

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
            maxHeight: "85%",
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            overflow: "hidden",
            zIndex: 1,
        },

        scrollView: {
            width: "100%",
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
            height: 200,
        },

        body: {
            paddingBottom: spacing.md,
        },

        contentWrap: {
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

        menuRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: spacing.md,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },

        menuName: {
            ...typography.body,
            color: colors.text,
            flex: 1,
        },

        price: {
            ...typography.body,
            color: colors.primary,
            fontWeight: "700",
        },
    });