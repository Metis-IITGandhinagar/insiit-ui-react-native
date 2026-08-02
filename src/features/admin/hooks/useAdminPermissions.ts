import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminService, AdminPermissions } from '../services/adminService';

export interface UseAdminPermissionsResult {
    permissions: AdminPermissions | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    canManageEvents: boolean;
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

    const canManageEvents = useMemo(() => {
        if (!permissions) return false;
        return Boolean(
            permissions.post_event 
        );
    }, [permissions]);

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
        return canManageEvents || canManageAnnouncements || canManageMessMenu || canManageUsers;
    }, [canManageEvents, canManageAnnouncements, canManageMessMenu, canManageUsers]);

    return {
        permissions,
        isLoading,
        error,
        refetch: fetchPermissions,
        canManageEvents,
        canManageAnnouncements,
        canManageMessMenu,
        canManageUsers,
        hasAnyAdminPermission,
    };
};