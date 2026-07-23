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
import { UserPlus, Trash2, Edit2, RefreshCw, X, Shield, User as UserIcon } from 'lucide-react-native';
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
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [permissionsState, setPermissionsState] = useState<AdminPermissions>({
        post_event: false,
        edit_event: false,
        delete_event: false,
        post_announcement: false,
        edit_announcement: false,
        delete_announcement: false,
        post_mess_menu: false,
        manage_users: false,
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
        setEditingAdmin(null);
        setName('');
        setEmail('');
        setPermissionsState({
            post_event: false,
            edit_event: false,
            delete_event: false,
            post_announcement: false,
            edit_announcement: false,
            delete_announcement: false,
            post_mess_menu: false,
            manage_users: false,
        });
    }, []);

    const handleOpenAddModal = useCallback(() => {
        resetForm();
        setIsModalOpen(true);
    }, [resetForm]);

    const handleOpenEditModal = useCallback((admin: AdminUser) => {
        setEditingAdmin(admin);
        setName(admin.name);
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
        if (!name.trim() || !email.trim()) {
            Alert.alert('Validation Error', 'Name and Email are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingAdmin) {
                await adminService.updatePermissions(editingAdmin.id, {
                    permissions: permissionsState,
                });
            } else {
                await adminService.createAdmin({
                    name: name.trim(),
                    email: email.trim(),
                    permissions: permissionsState,
                });
            }
            handleCloseModal();
            await fetchAdmins();
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to save administrative user.');
        } finally {
            setIsSubmitting(false);
        }
    }, [name, email, editingAdmin, permissionsState, handleCloseModal, fetchAdmins]);

    const handleDelete = useCallback((id: string) => {
        Alert.alert(
            'Delete Admin',
            'Are you sure you want to revoke all administrative access for this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Revoke Access',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(id);
                            await adminService.deleteAdmin(id);
                            await fetchAdmins();
                        } catch (err: any) {
                            Alert.alert('Error', 'Failed to delete administrative user.');
                        } finally {
                            setIsDeleting(null);
                        }
                    },
                },
            ]
        );
    }, [fetchAdmins]);

    const renderAdminItem = useCallback(({ item }: { item: AdminUser }) => {
        const activeCount = Object.values(item.permissions || {}).filter(Boolean).length;

        return (
            <Card variant="surface" style={styles.cardOverride}>
                <View style={styles.userHeader}>
                    <View
                        style={[
                            styles.avatarContainer,
                            { backgroundColor: colors.primary ? `${colors.primary}15` : 'rgba(0,0,0,0.05)', borderRadius: radius.xl ?? 9999 },
                        ]}
                    >
                        <UserIcon size={20} color={colors.primary} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: colors.text, fontSize: typography.h3?.fontSize || 16, fontWeight: '700' }]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.userEmail, { color: colors.textSecondary, fontSize: typography.h2?.fontSize || 13 }]}>
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

                <View style={[styles.actionRow, { borderTopColor: colors.border || '#E5E7EB' }]}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                        onPress={() => handleOpenEditModal(item)}
                        activeOpacity={0.7}
                    >
                        <Edit2 size={16} color={colors.primary} />
                        <Text style={[styles.actionText, { color: colors.primary, fontSize: 12, fontWeight: '600' }]}>
                            Edit Permissions
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                        onPress={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        activeOpacity={0.7}
                    >
                        {isDeleting === item.id ? (
                            <ActivityIndicator size="small" color={colors.danger || '#EF4444'} />
                        ) : (
                            <>
                                <Trash2 size={16} color={colors.danger || '#EF4444'} />
                                <Text style={[styles.actionText, { color: colors.danger || '#EF4444', fontSize: 12, fontWeight: '600' }]}>
                                    Revoke
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </Card>
        );
    }, [colors, typography, radius, handleOpenEditModal, handleDelete, isDeleting]);

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
                        keyExtractor={(item) => item.id}
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
                                {editingAdmin ? 'Edit Admin Permissions' : 'New Admin User'}
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
                            {!editingAdmin && (
                                <>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }]}
                                        placeholder="Full Name"
                                        placeholderTextColor={colors.textSecondary || '#999'}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                    <TextInput
                                        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg }]}
                                        placeholder="IITGN Email Address"
                                        placeholderTextColor={colors.textSecondary || '#999'}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </>
                            )}

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
    cardOverride: { marginBottom: 16 },
    userHeader: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    userInfo: { flex: 1 },
    userName: {},
    userEmail: { marginTop: 2 },
    permissionBadgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, marginTop: 12, gap: 8 },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    actionText: { marginLeft: 4 },
    retryButton: { flexDirection: 'row', alignItems: 'center' },
    fab: { position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65 },
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
    input: { fontSize: 16 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
});