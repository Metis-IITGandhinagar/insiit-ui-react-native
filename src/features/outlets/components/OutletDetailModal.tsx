import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import SheetModal from "@/shared/components/SheetModal";
import { useTheme } from "@/core/theme";
import { resolveBackendAsset } from "@/core/api/apiClient";
import { Outlet } from "../services/outletTypes";
import { checkIsOpen } from "./OutletCard";

interface Props {
    visible: boolean;
    outlet: Outlet | null;
    onClose: () => void;
}

const formatTime = (time: string) => {
    if (!time) return "";
    const parsed = new Date(time);
    if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    }
    return time;
};

const OutletDetailModal = ({
    visible,
    outlet,
    onClose,
}: Props) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    if (!outlet) return null;

    const isOpen = checkIsOpen(outlet.open_time, outlet.close_time);

    return (
        <SheetModal visible={visible} onClose={onClose} sheetStyle={styles.sheetCap}>
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
                        <View style={styles.imageContainer}>
                            <Image
                                source={{
                                    uri:
                                        resolveBackendAsset(outlet.image_url) ||
                                        "https://placehold.co/800x500?text=Outlet",
                                }}
                                style={styles.image}
                            />
                            <View style={[styles.badge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
                                <Text style={styles.badgeText}>{isOpen ? "OPEN" : "CLOSED"}</Text>
                            </View>
                        </View>

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
                                    {formatTime(outlet.open_time)} - {formatTime(outlet.close_time)}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>
                                Menu
                            </Text>

                            {outlet.menu && outlet.menu.map((item) => (
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
        </SheetModal>
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
        // The cap sits on the sliding layer: a percentage needs a parent with a
        // definite height, and the sheet wrapper sizes itself to its content.
        sheetCap: {
            maxHeight: "85%",
        },

        modal: {
            width: "100%",
            flexShrink: 1,
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
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

        imageContainer: {
            position: "relative",
        },

        image: {
            width: "100%",
            height: 200,
        },

        badge: {
            position: "absolute",
            right: 14,
            bottom: 14,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 50,
        },

        badgeOpen: {
            backgroundColor: "#16A34A",
        },

        badgeClosed: {
            backgroundColor: "#DC2626",
        },

        badgeText: {
            color: "#fff",
            fontWeight: "700",
            fontSize: 11,
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