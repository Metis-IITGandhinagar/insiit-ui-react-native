import React, { useMemo, useState } from "react";
import {
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Search, X } from "lucide-react-native";

import { useTheme } from "@/core/theme";
import { useAuth } from "@/core/auth/useAuth";
import { useGlobalSearch, type SearchResultItem } from "../hooks/useGlobalSearch";

export default function GlobalSearchScreen() {
    const [query, setQuery] = useState("");

    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const navigation = useNavigation<any>();
    const { user, isGuest } = useAuth();

    const sections = useGlobalSearch(query, !!user);

    const resultCount = useMemo(
        () => sections.reduce((total, section) => total + section.data.length, 0),
        [sections]
    );

    /**
     * Tabs live inside MainTabs' own pager, so jumping to one means returning to
     * MainTabs with a `tab` param rather than pushing a route. Stack screens push
     * normally — and either way the search screen is left behind, so coming back
     * lands on the destination instead of on a stale query.
     */
    const openResult = (item: SearchResultItem) => {
        if (item.target.kind === "tab") {
            navigation.navigate("MainTabs", { tab: item.target.tab });
            return;
        }

        navigation.replace(item.target.screen);
    };

    return (
        <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
            <StatusBar
                barStyle={theme.isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.background}
            />

            <View style={styles.searchBar}>
                <Search size={20} color={colors.textSecondary} />

                <TextInput
                    style={styles.input}
                    placeholder="Search INSIIT"
                    placeholderTextColor={colors.textSecondary}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                />

                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
                        <X size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                renderSectionFooter={({ section }) =>
                    section.hiddenCount > 0 ? (
                        <Text style={styles.sectionFooter}>
                            +{section.hiddenCount} more {section.title.toLowerCase()}
                        </Text>
                    ) : null
                }
                renderItem={({ item }) => {
                    const Icon = item.icon;

                    return (
                        <TouchableOpacity
                            style={styles.row}
                            activeOpacity={0.7}
                            onPress={() => openResult(item)}
                        >
                            <View style={styles.rowIcon}>
                                <Icon size={20} color={colors.primary} strokeWidth={2} />
                            </View>

                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text style={styles.rowSubtitle} numberOfLines={1}>
                                    {item.subtitle}
                                </Text>
                            </View>

                            <ChevronRight size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        {query.trim().length === 0 ? (
                            <>
                                <Text style={styles.emptyTitle}>Search anything</Text>
                                <Text style={styles.emptyBody}>
                                    Screens, announcements, events, outlets, listings and lost
                                    items — all searchable, all offline.
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.emptyTitle}>No results for “{query.trim()}”</Text>
                                <Text style={styles.emptyBody}>
                                    {isGuest
                                        ? "Try a different word. Some results are only available once you sign in."
                                        : "Try a different word. Content you haven't opened yet won't be searchable until it loads once."}
                                </Text>
                            </>
                        )}
                    </View>
                }
            />

            {resultCount > 0 && (
                <Text style={styles.countFooter}>
                    {resultCount} result{resultCount === 1 ? "" : "s"}
                </Text>
            )}
        </SafeAreaView>
    );
}

const getStyles = ({ colors, radius, spacing, typography }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        searchBar: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            marginHorizontal: spacing.lg,
            marginTop: spacing.md,
            marginBottom: spacing.sm,
            paddingHorizontal: spacing.md,
            height: 48,
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
        },
        listContent: {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xxl,
        },
        sectionHeader: {
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: colors.textSecondary,
            backgroundColor: colors.background,
            paddingTop: spacing.lg,
            paddingBottom: spacing.sm,
        },
        sectionFooter: {
            fontSize: 12,
            color: colors.textSecondary,
            paddingTop: spacing.xs,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            paddingVertical: spacing.md,
        },
        rowIcon: {
            width: 38,
            height: 38,
            borderRadius: radius.md,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surface,
        },
        rowText: {
            flex: 1,
        },
        rowTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
        },
        rowSubtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
        },
        empty: {
            paddingTop: spacing.xxl,
            alignItems: "center",
            gap: spacing.sm,
        },
        emptyTitle: {
            fontSize: typography.h3.fontSize,
            fontWeight: "700",
            color: colors.text,
            textAlign: "center",
        },
        emptyBody: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.textSecondary,
            textAlign: "center",
            paddingHorizontal: spacing.lg,
        },
        countFooter: {
            textAlign: "center",
            fontSize: 12,
            color: colors.textSecondary,
            paddingVertical: spacing.sm,
        },
    });
