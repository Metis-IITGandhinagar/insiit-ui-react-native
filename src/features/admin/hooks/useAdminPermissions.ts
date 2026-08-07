import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminService, AdminPermissions } from '../services/adminService';

export interface UseAdminPermissionsResult {
    permissions: AdminPermissions | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    canManageAnnouncements: boolean;
    canManageMessMenu: boolean;
    canManageUsers: boolean;
    hasAnyAdminPermission: boolean;
}

export const useAdminPermissions = (): UseAdminPermissionsResult => {
    const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPermissions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminService.fetchPermissions();
            setPermissions(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch admin permissions'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // No canManageEvents: events are authored and edited from the Events tab, scoped to
    // the author by the backend. There is no admin moderation of other people's events.
    const canManageAnnouncements = useMemo(() => {
        if (!permissions) return false;
        return Boolean(permissions.post_announcement);
    }, [permissions]);

    const canManageMessMenu = useMemo(() => {
        if (!permissions) return false;
        return Boolean(permissions.post_mess_menu);
    }, [permissions]);

    const canManageUsers = useMemo(() => {
        if (!permissions) return false;
        return Boolean(
            permissions.get_admin ||
            permissions.post_admin ||
            permissions.put_admin
        );
    }, [permissions]);

    const hasAnyAdminPermission = useMemo(() => {
        return canManageAnnouncements || canManageMessMenu || canManageUsers;
    }, [canManageAnnouncements, canManageMessMenu, canManageUsers]);

    return {
        permissions,
        isLoading,
        error,
        refetch: fetchPermissions,
        canManageAnnouncements,
        canManageMessMenu,
        canManageUsers,
        hasAnyAdminPermission,
    };
};