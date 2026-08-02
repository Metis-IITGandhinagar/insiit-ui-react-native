import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    Switch,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { UserPlus, RefreshCw, X, Shield, User as UserIcon } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { Card } from '@shared/components/Card';
import { PermissionGate } from '../components/PermissionGate';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { adminService, AdminUser, AdminPermissions } from '../services/adminService';

export const UserManagementScreen: React.FC = () => {
    const { colors, spacing, typography, radius } = useTheme();
    const { canManageUsers } = useAdminPermissions();

    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [permissionsState, setPermissionsState] = useState<AdminPermissions>({
        get_admin: false,
        post_admin: false,
        put_admin: false,
        post_event: false,
        post_mess_menu: false,
        post_announcement: false,
    });

    const fetchAdmins = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminService.fetchAdmins();
            setAdmins(data);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch administrative users.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const resetForm = useCallback(() => {
        setEmail('');
        setPermissionsState({
            get_admin: false,
            post_admin: false,
            put_admin: false,
            post_event: false,
            post_mess_menu: false,
            post_announcement: false,
        });
    }, []);

    const handleOpenAddModal = useCallback(() => {
        resetForm();
        setIsModalOpen(true);
    }, [resetForm]);

    const handleSelectAdminForUpsert = useCallback((admin: AdminUser) => {
        setEmail(admin.email);
        setPermissionsState(admin.permissions);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        resetForm();
    }, [isSubmitting, resetForm]);

    const togglePermission = useCallback((key: keyof AdminPermissions) => {
        setPermissionsState((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Email address is required.');
            return;
        }

        setIsSubmitting(true);
        try {
            await adminService.createAdmin({
                email: email.trim(),
                permissions: permissionsState,
            });
            handleCloseModal();
            await fetchAdmins();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to save administrative user.');
        } finally {
            setIsSubmitting(false);
        }
    }, [email, permissionsState, handleCloseModal, fetchAdmins]);

    const renderAdminItem = useCallback(({ item }: { item: AdminUser }) => {
        const activeCount = Object.values(item.permissions || {}).filter(Boolean).length;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectAdminForUpsert(item)}
            >
                <Card variant="surface" style={styles.cardOverride}>
                    <View style={styles.userHeader}>
                        <View
                            style={[
                                styles.avatarContainer,
                                {
                                    backgroundColor: colors.primary ? `${colors.primary}15` : 'rgba(0,0,0,0.05)',
                                    borderRadius: radius.xl ?? 9999
                                },
                            ]}
                        >
                            <UserIcon size={20} color={colors.primary} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userEmail, { color: colors.text, fontSize: typography.h1?.fontSize || 16, fontWeight: '600' }]}>
                                {item.email}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.permissionBadgeContainer}>
                        <Shield size={14} color={colors.primary} style={{ marginRight: 6 }} />
                        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                            {activeCount} Permissions Granted
                        </Text>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }, [colors, typography, radius, handleSelectAdminForUpsert]);

    return (
        <PermissionGate hasPermission={canManageUsers}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {isLoading && !admins.length ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error && !admins.length ? (
                    <View style={[styles.centered, { padding: spacing.xl }]}>
                        <Text style={{ color: colors.text, fontSize: typography.h3?.fontSize || 20, fontWeight: '700', marginBottom: spacing.xs, textAlign: 'center' }}>
                            Failed to Load
                        </Text>
                        <Text style={{ color: colors.textSecondary, fontSize: typography.h2?.fontSize || 14, marginBottom: spacing.lg, textAlign: 'center' }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={fetchAdmins}
                            style={[styles.retryButton, { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md }]}
                        >
                            <RefreshCw size={16} color={colors.primary || '#FFFFFF'} style={{ marginRight: 8 }} />
                            <Text style={{ color: colors.primary || '#FFFFFF', fontWeight: '600' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={admins}
                        keyExtractor={(item) => item.email}
                        renderItem={renderAdminItem}
                        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
                        refreshing={isLoading}
                        onRefresh={fetchAdmins}
                        ListEmptyComponent={
                            <View style={[styles.centered, { paddingVertical: spacing.xxl }]}>
                                <Text style={{ color: colors.textSecondary, fontSize: typography.h1?.fontSize || 16 }}>
                                    No administrative users configured.
                                </Text>
                            </View>
                        }
                    />
                )}

                <TouchableOpacity
                    style={[
                        styles.fab,
                        {
                            backgroundColor: colors.primary,
                            borderRadius: radius.xl ?? 9999,
                            bottom: spacing.xl,
                            right: spacing.xl,
                        },
                    ]}
                    onPress={handleOpenAddModal}
                    activeOpacity={0.8}
                >
                    <UserPlus size={24} color={colors.primary || '#FFFFFF'} />
                </TouchableOpacity>

                <Modal
                    visible={isModalOpen}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={handleCloseModal}
                >
                    <KeyboardAvoidingView
                        style={[styles.modalContainer, { backgroundColor: colors.background }]}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border || '#EEE', padding: spacing.lg }]}>
                            <TouchableOpacity onPress={handleCloseModal} disabled={isSubmitting}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[{ color: colors.text, fontSize: typography.h3?.fontSize || 18, fontWeight: '700' }]}>
                                Configure Admin User
                            </Text>
                            <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                                        Save
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.surface,
                                        color: colors.text,
                                        borderRadius: radius.md,
                                        padding: spacing.md,
                                        marginBottom: spacing.lg
                                    }
                                ]}
                                placeholder="IITGN Email Address"
                                placeholderTextColor={colors.textSecondary || '#999'}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={{ color: colors.text, fontSize: typography.h3?.fontSize || 16, fontWeight: '700', marginBottom: spacing.md }}>
                                Assign Permissions
                            </Text>

                            {(Object.keys(permissionsState) as Array<keyof AdminPermissions>).map((key) => (
                                <View key={key} style={[styles.switchRow, { borderBottomColor: colors.border || '#F0F0F0', paddingVertical: spacing.sm }]}>
                                    <Text style={{ color: colors.text, fontSize: 15, textTransform: 'capitalize' }}>
                                        {key.replace(/_/g, ' ')}
                                    </Text>
                                    <Switch
                                        value={permissionsState[key]}
                                        onValueChange={() => togglePermission(key)}
                                        trackColor={{ false: '#D1D5DB', true: colors.primary }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </PermissionGate>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { flexGrow: 1 },
    cardOverride: { marginBottom: 12 },
    userHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    userInfo: { flex: 1 },
    userEmail: {},
    permissionBadgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    retryButton: { flexDirection: 'row', alignItems: 'center' },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65
    },
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
    input: { fontSize: 16 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
});