import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { RefreshCw, Save, Utensils } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { Card } from '@shared/components/Card';
import { PermissionGate } from '../components/PermissionGate';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { apiClient } from '@core/api/apiClient';

export interface MessMenu {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
}

export const MessMenuManagementScreen: React.FC = () => {
    const { colors, spacing, typography, radius } = useTheme();
    const { canManageMessMenu } = useAdminPermissions();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [menu, setMenu] = useState<MessMenu>({
        breakfast: '',
        lunch: '',
        snacks: '',
        dinner: '',
    });

    const fetchMessMenu = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<MessMenu>('/mess/menu');
            setMenu({
                breakfast: response.data.breakfast || '',
                lunch: response.data.lunch || '',
                snacks: response.data.snacks || '',
                dinner: response.data.dinner || '',
            });
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch mess menu details.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessMenu();
    }, [fetchMessMenu]);

    const handleFieldChange = useCallback((field: keyof MessMenu, value: string) => {
        setMenu((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSaveMenu = useCallback(async () => {
        setIsSaving(true);
        try {
            await apiClient.put('/mess/menu', menu);
            Alert.alert('Success', 'Mess menu updated successfully!');
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to update mess menu.');
        } finally {
            setIsSaving(false);
        }
    }, [menu]);

    return (
        <PermissionGate hasPermission={canManageMessMenu}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {isLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error ? (
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
                            onPress={fetchMessMenu}
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
                    <ScrollView
                        contentContainerStyle={[styles.contentContainer, { padding: spacing.lg }]}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.header}>
                            <Utensils size={24} color={colors.primary} style={styles.headerIcon} />
                            <Text
                                style={[
                                    styles.headerTitle,
                                    {
                                        color: colors.text,
                                        fontSize: typography.h2?.fontSize || 22,
                                        fontWeight: '700',
                                    },
                                ]}
                            >
                                Today's Mess Schedule
                            </Text>
                        </View>

                        <Card variant="surface" style={styles.cardOverride}>
                            <Text style={[styles.mealLabel, { color: colors.text, fontSize: typography.h1?.fontSize || 16 }]}>
                                Breakfast
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                        marginBottom: spacing.md,
                                    },
                                ]}
                                placeholder="Breakfast menu items..."
                                placeholderTextColor={colors.textSecondary || '#999'}
                                multiline
                                numberOfLines={3}
                                value={menu.breakfast}
                                onChangeText={(val) => handleFieldChange('breakfast', val)}
                            />

                            <Text style={[styles.mealLabel, { color: colors.text, fontSize: typography.h1?.fontSize || 16 }]}>
                                Lunch
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                        marginBottom: spacing.md,
                                    },
                                ]}
                                placeholder="Lunch menu items..."
                                placeholderTextColor={colors.textSecondary || '#999'}
                                multiline
                                numberOfLines={3}
                                value={menu.lunch}
                                onChangeText={(val) => handleFieldChange('lunch', val)}
                            />

                            <Text style={[styles.mealLabel, { color: colors.text, fontSize: typography.h1?.fontSize || 16 }]}>
                                Evening Snacks
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                        marginBottom: spacing.md,
                                    },
                                ]}
                                placeholder="Snacks menu items..."
                                placeholderTextColor={colors.textSecondary || '#999'}
                                multiline
                                numberOfLines={3}
                                value={menu.snacks}
                                onChangeText={(val) => handleFieldChange('snacks', val)}
                            />

                            <Text style={[styles.mealLabel, { color: colors.text, fontSize: typography.h1?.fontSize || 16 }]}>
                                Dinner
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                        marginBottom: spacing.lg,
                                    },
                                ]}
                                placeholder="Dinner menu items..."
                                placeholderTextColor={colors.textSecondary || '#999'}
                                multiline
                                numberOfLines={3}
                                value={menu.dinner}
                                onChangeText={(val) => handleFieldChange('dinner', val)}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    {
                                        backgroundColor: colors.primary,
                                        borderRadius: radius.md,
                                        paddingVertical: spacing.md,
                                    },
                                ]}
                                onPress={handleSaveMenu}
                                disabled={isSaving}
                                activeOpacity={0.8}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color={colors.primary || '#FFFFFF'} />
                                ) : (
                                    <>
                                        <Save size={18} color={colors.primary || '#FFFFFF'} style={{ marginRight: 8 }} />
                                        <Text style={{ color: colors.primary || '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                                            Save Schedule
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </Card>
                    </ScrollView>
                )}
            </View>
        </PermissionGate>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerIcon: {
        marginRight: 10,
    },
    headerTitle: {
        letterSpacing: -0.3,
    },
    cardOverride: {
        marginBottom: 24,
    },
    mealLabel: {
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        fontSize: 15,
        textAlignVertical: 'top',
        minHeight: 70,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});