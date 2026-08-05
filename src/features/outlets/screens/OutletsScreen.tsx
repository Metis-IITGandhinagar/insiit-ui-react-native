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
import { ArrowLeft } from "lucide-react-native";

import { useTheme } from "@/core/theme";

import { useOutletData } from "../hooks/useOutletData";
import { Outlet } from "../services/outletTypes";
import OutletCard from "../components/OutletCard";
import OutletDetailModal from "../components/OutletDetailModal";

export default function OutletsScreen() {
    const navigation = useNavigation<any>();

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const {
        outlets,
        loading,
        error,
        refresh,
    } = useOutletData();

    const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            <SafeAreaView
                style={styles.container}
                edges={["top", "left", "right"]}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft
                            size={18}
                            color={colors.text}
                        />
                    </TouchableOpacity>

                    <View style={styles.headerTextWrap}>
                        <Text style={styles.title}>
                            Campus Outlets
                        </Text>

                        <Text style={styles.subtitle}>
                            Browse campus cafés, food courts and stores.
                        </Text>
                    </View>
                </View>

                {loading && outlets.length === 0 ? (
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
                        data={outlets}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={refresh}
                            />
                        }
                        renderItem={({ item }) => (
                            <OutletCard
                                outlet={item}
                                onPress={() =>
                                    setSelectedOutlet(item)
                                }
                            />
                        )}
                    />
                )}

                <OutletDetailModal
                    visible={selectedOutlet !== null}
                    outlet={selectedOutlet}
                    onClose={() =>
                        setSelectedOutlet(null)
                    }
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
    });