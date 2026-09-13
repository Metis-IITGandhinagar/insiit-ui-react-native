import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';
import { AdminPermissions } from '../services/adminService';

export interface UseAdminPermissionsResult {
    permissions: AdminPermissions | null;
    isLoading: boolean;
    /** A manual `refetch()` is in flight while permissions are already on screen. */
    isRefreshing: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    canManageAnnouncements: boolean;
    canManageMessMenu: boolean;
    canManageUsers: boolean;
    canManageEvents: boolean;
    hasAnyAdminPermission: boolean;
}

/**
 * Admin rights, read from the auth session rather than fetched again.
 *
 * This used to issue its own `/admin/permissions` request on every mount, duplicating
 * the one AuthProvider already makes and giving the two a chance to disagree. The
 * provider now owns that call, caches the result per account, and refreshes it in the
 * background — so this hook is pure derivation, works offline, and renders the admin
 * entry points on the first frame instead of after a round-trip.
 */
export const useAdminPermissions = (): UseAdminPermissionsResult => {
    const { user, loading, refreshPermissions } = useAuth();
    const [error, setError] = useState<Error | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const permissions = user?.permissions ?? null;

    const refetch = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await refreshPermissions();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch admin permissions'));
        } finally {
            setIsRefreshing(false);
        }
    }, [refreshPermissions]);

    /**
     * Revalidate every time the console is opened.
     *
     * The cached permissions render instantly, but they're only synced on auth state
     * changes — so a permission granted after the app launched stayed invisible until
     * the next cold start, which reads as "my admin rights don't work". The hook this
     * replaced fetched on every mount; this keeps that guarantee while still painting
     * from cache first. Failure is silent: the cached copy stands.
     */
    useEffect(() => {
        if (!user?.email) return;

        refreshPermissions().catch(() => {
            // Offline or server down — the cached permissions remain correct enough.
        });
    }, [refreshPermissions, user?.email]);

    const canManageEvents = useMemo(() => {
        if (!permissions) return false;
        return Boolean(permissions.manage_events);
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
        return canManageAnnouncements || canManageMessMenu || canManageUsers || canManageEvents;
    }, [canManageAnnouncements, canManageMessMenu, canManageUsers, canManageEvents]);

    return {
        permissions,
        isLoading: loading,
        isRefreshing,
        error,
        refetch,
        canManageAnnouncements,
        canManageMessMenu,
        canManageUsers,
        canManageEvents,
        hasAnyAdminPermission,
    };
};
