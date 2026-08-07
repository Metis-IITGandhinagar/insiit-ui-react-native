import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Plus } from "lucide-react-native";

import { useTheme } from "@/core/theme";
import { useAuthGate } from "@/core/auth/useAuthGate";

import { useLostFoundData } from "../hooks/useLostFoundData";
import { LostFoundEntry } from "../services/lostFoundTypes";
import LostFoundCard from "../components/LostFoundCard";
import LostFoundDetailModal from "../components/LostFoundDetailModal";
import AddLostItemModal from "../components/AddLostItemModal";

export default function LostFoundScreen() {
    const navigation = useNavigation<any>();

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const { ensureSignedIn } = useAuthGate();

    const {
        entries,
        loading,
        error,
        refresh,
        addEntry,
        editEntry,
        deleteEntry,
        markFound,
        claimFound,
    } = useLostFoundData();

    const [selectedEntry, setSelectedEntry] =
        useState<LostFoundEntry | null>(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editingEntry, setEditingEntry] =
        useState<LostFoundEntry | null>(null);

    const closeDetail = () => setSelectedEntry(null);

    const handleClaimFound = async (remarks: string) => {
        if (!selectedEntry) return;
        if (!ensureSignedIn("tell the owner you found this")) return;
        const updated = await claimFound({
            id: selectedEntry.id,
            item_name: selectedEntry.item_name,
            remarks,
        });
        setSelectedEntry(updated);
    };

    const handleMarkFound = async () => {
        if (!selectedEntry) return;
        const updated = await markFound(selectedEntry);
        setSelectedEntry(updated);
    };

    const handleDelete = async () => {
        if (!selectedEntry) return;
        await deleteEntry(selectedEntry.id);
    };

    const handleEditRequested = () => {
        if (!selectedEntry) return;
        setEditingEntry(selectedEntry);
        setSelectedEntry(null);
        setAddModalVisible(true);
    };

    const handleAddOrEditSubmit = async (request: any) => {
        if (editingEntry) {
            await editEntry(editingEntry.id, request);
        } else {
            await addEntry(request);
        }
    };

    const handleAddModalClose = () => {
        setAddModalVisible(false);
        setEditingEntry(null);
    };

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            {/* No in-screen header: the stack header provides the title and back
                button (see notes.md, "Navigation"). */}
            <SafeAreaView
                style={styles.container}
                edges={["left", "right"]}
            >
                {loading && entries.length === 0 ? (
                    <View style={styles.center}>
                        <ActivityIndicator
                            size="large"
                            color={colors.primary}
                        />
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={refresh}
                        >
                            <Text style={styles.retryText}>
                                Retry
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={entries}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading && entries.length > 0}
                                onRefresh={refresh}
                            />
                        }
                        ListHeaderComponent={
                            <View style={styles.heroCard}>
                                <Text style={styles.heroTitle}>
                                    Lost something on campus?
                                </Text>

                                <Text style={styles.heroSubtitle}>
                                    Browse active reports below,
                                    or report a lost item so the
                                    community can help you find
                                    it.
                                </Text>

                                <TouchableOpacity
                                    style={styles.heroButton}
                                    onPress={() => {
                                        if (!ensureSignedIn("report a lost item")) return;
                                        setAddModalVisible(true);
                                    }}
                                >
                                    <Plus size={16} color="#FFF" />
                                    <Text style={styles.heroButtonText}>
                                        Report Lost Item
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    No active reports right now.
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <LostFoundCard
                                entry={item}
                                onPress={() =>
                                    setSelectedEntry(item)
                                }
                            />
                        )}
                    />
                )}

                <LostFoundDetailModal
                    visible={selectedEntry !== null}
                    entry={selectedEntry}
                    onClose={closeDetail}
                    onClaimFound={handleClaimFound}
                    onMarkFound={handleMarkFound}
                    onEdit={handleEditRequested}
                    onDelete={handleDelete}
                />

                <AddLostItemModal
                    visible={addModalVisible}
                    onClose={handleAddModalClose}
                    onSubmit={handleAddOrEditSubmit}
                    editingEntry={editingEntry}
                />
            </SafeAreaView>
        </>
    );
}

const getStyles = ({
    colors,
    spacing,
    radius,
    typography,
}: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        header: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
        },

        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
        },

        headerTextWrap: {
            flex: 1,
            marginLeft: spacing.md,
        },

        title: {
            ...typography.h2,
            color: colors.text,
        },

        subtitle: {
            color: colors.textSecondary,
            fontSize: 13,
            marginTop: 2,
        },

        addButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
            marginLeft: spacing.md,
        },

        content: {
            paddingHorizontal: spacing.lg,
            paddingBottom: 120,
            paddingTop: spacing.sm,
        },

        heroCard: {
            backgroundColor: colors.primary + "12",
            borderRadius: radius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.primary + "20",
            marginBottom: spacing.lg,
        },

        heroTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 6,
        },

        heroSubtitle: {
            color: colors.textSecondary,
            lineHeight: 20,
            marginBottom: spacing.md,
        },

        heroButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            paddingVertical: spacing.sm,
            borderRadius: radius.round,
            alignSelf: "flex-start",
            paddingHorizontal: spacing.lg,
        },

        heroButtonText: {
            color: "#FFF",
            fontWeight: "700",
            marginLeft: 6,
        },

        center: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
        },

        errorText: {
            color: colors.textSecondary,
            marginBottom: spacing.lg,
            textAlign: "center",
        },

        retryButton: {
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: radius.round,
        },

        retryText: {
            color: "#FFF",
            fontWeight: "700",
        },

        emptyState: {
            paddingVertical: spacing.xl * 2,
            alignItems: "center",
        },

        emptyStateText: {
            color: colors.textSecondary,
        },
    });