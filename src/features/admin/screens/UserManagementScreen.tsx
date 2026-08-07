import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { RefreshCw, Shield, User as UserIcon } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { Card } from '@shared/components/Card';
import { PermissionGate } from '../components/PermissionGate';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { adminService, AdminUser } from '../services/adminService';

/**
 * Read-only. Admins are granted and revoked with psql on the server — there are
 * fewer than 20 of them and no super-admin role in the app.
 */
export const UserManagementScreen: React.FC = () => {
    const { colors, spacing, typography, radius } = useTheme();
    const { canManageUsers } = useAdminPermissions();

    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const renderAdminItem = useCallback(({ item }: { item: AdminUser }) => {
        const granted = Object.entries(item.permissions || {})
            .filter(([, isGranted]) => isGranted)
            .map(([key]) => key.replace(/_/g, ' '));

        return (
            <Card variant="surface" style={styles.cardOverride}>
                <View style={styles.userHeader}>
                    <View
                        style={[
                            styles.avatarContainer,
                            {
                                backgroundColor: colors.primary ? `${colors.primary}15` : 'rgba(0,0,0,0.05)',
                                borderRadius: radius.xl ?? 9999,
                            },
                        ]}
                    >
                        <UserIcon size={20} color={colors.primary} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userEmail, { color: colors.text, fontSize: 16, fontWeight: '600' }]}>
                            {item.email}
                        </Text>
                    </View>
                </View>

                <View style={styles.permissionBadgeContainer}>
                    <Shield size={14} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                        {granted.length} Permissions Granted
                    </Text>
                </View>

                {granted.length > 0 && (
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 6, lineHeight: 18 }}>
                        {granted.join(' · ')}
                    </Text>
                )}
            </Card>
        );
    }, [colors, radius]);

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
                        <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: spacing.lg, textAlign: 'center' }}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={fetchAdmins}
                            style={[styles.retryButton, { backgroundColor: `${colors.primary}15`, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md }]}
                        >
                            <RefreshCw size={16} color={colors.primary} style={{ marginRight: 8 }} />
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>Retry</Text>
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
                        ListHeaderComponent={
                            <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: spacing.md }}>
                                Permissions are managed directly on the server. This list is read-only.
                            </Text>
                        }
                        ListEmptyComponent={
                            <View style={[styles.centered, { paddingVertical: spacing.xxl }]}>
                                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                                    No administrative users configured.
                                </Text>
                            </View>
                        }
                    />
                )}
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
});
