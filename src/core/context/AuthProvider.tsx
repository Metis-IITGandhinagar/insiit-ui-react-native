import React, { createContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { nativeAuth } from '../auth/firebase';
import { authService } from '../auth/authService';
import { userService } from '../api/userService';
import { readCache, writeCache, removeCacheByPrefix, adminPermissionsPolicy, USER_SCOPED_PREFIX } from '../cache';
import { UserSessionProfile, AppPermissions, NO_PERMISSIONS } from '../navigation/types';

interface AuthContextType {
    /** The signed-in IITGN student. Null while browsing as a guest. */
    user: UserSessionProfile | null;
    /** An anonymous Firebase session. Never true at the same time as a non-null user. */
    isGuest: boolean;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    continueAsGuest: () => Promise<void>;
    /** Ends the anonymous session and returns to the login screen. */
    exitGuestMode: () => Promise<void>;
    hasPermission: (permissionKey: keyof AppPermissions) => boolean;
    /**
     * Re-fetches admin permissions for the current user. The single place that call is
     * made, so the admin screens can't drift from what the rest of the app believes.
     * Resolves either way — a failure keeps the cached value.
     */
    refreshPermissions: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_STUDENT_PERMISSIONS: AppPermissions = NO_PERMISSIONS;

/** The parts of the profile that come straight off the local Firebase session. */
function localProfileFields(firebaseUser: any) {
    const providerData = firebaseUser.providerData?.[0] || {};

    return {
        email: firebaseUser.email || providerData.email || '',
        displayName: firebaseUser.displayName || providerData.displayName || 'IITGN Student',
        photoURL: firebaseUser.photoURL || providerData.photoURL || null,
    };
}

/**
 * The profile to render immediately, built entirely from local state: the Firebase
 * session is already on disk, and permissions come from the synchronous cache.
 *
 * This used to `await` the permissions endpoint before the app could render anything
 * at all, which meant every cold start blocked on a network round-trip — up to the
 * full axios timeout on bad wifi — to fetch a value that is null for almost every
 * user. It's now fetched in the background and merged in when it lands.
 */
function buildLocalProfile(firebaseUser: any): UserSessionProfile {
    const fields = localProfileFields(firebaseUser);
    const cached = fields.email
        ? readCache<AppPermissions>(adminPermissionsPolicy(fields.email).key, {
              version: adminPermissionsPolicy(fields.email).version,
          })
        : null;

    return {
        ...fields,
        permissions: cached?.data ?? DEFAULT_STUDENT_PERMISSIONS,
    };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSessionProfile | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Incremented on every auth transition so a permissions response that arrives
    // after a sign-out (or a switch to another account) is discarded instead of
    // granting the wrong person admin rights.
    const sessionRef = useRef(0);

    /**
     * Refreshes permissions without blocking the UI. Failure is silent and expected:
     * offline, or simply not an admin, both leave the cached/default value in place.
     */
    const syncPermissionsInBackground = async (email: string, session: number) => {
        if (!email) return;

        try {
            const permissions = await userService.fetchUserPermissions();
            if (sessionRef.current !== session) return;

            const policy = adminPermissionsPolicy(email);
            const resolved = permissions || DEFAULT_STUDENT_PERMISSIONS;
            writeCache(policy.key, resolved, { version: policy.version });

            setUser((current) =>
                current && current.email === email ? { ...current, permissions: resolved } : current
            );
        } catch (error) {
            console.warn('Could not refresh admin permissions; keeping the cached copy.', error);
        }
    };

    useEffect(() => {
        const unsubscribe = nativeAuth.onAuthStateChanged(async (firebaseUser) => {
            const session = ++sessionRef.current;

            try {
                if (!firebaseUser) {
                    setUser(null);
                    setIsGuest(false);
                    return;
                }

                // Anonymous sessions are guests: a real Firebase session, but no
                // identity. Deliberately left as user === null so every ownership and
                // permission check in the app fails closed without special-casing.
                if (firebaseUser.isAnonymous) {
                    setUser(null);
                    setIsGuest(true);
                    return;
                }

                const email = firebaseUser.email || '';
                if (!email.toLowerCase().endsWith('@iitgn.ac.in')) {
                    await authService.logout();
                    setUser(null);
                    setIsGuest(false);
                    return;
                }

                setUser(buildLocalProfile(firebaseUser));
                setIsGuest(false);

                // Deliberately not awaited — the app is already interactive by here.
                syncPermissionsInBackground(email, session);
            } catch (error) {
                console.error('Failed to restore session on boot:', error);
                await authService.logout();
                setUser(null);
                setIsGuest(false);
            } finally {
                // Every branch above is local-only, so this now runs within a frame or
                // two of launch rather than after a network call.
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const signIn = async () => {
        setLoading(true);
        try {
            const loggedInUser = await authService.login();

            if (!loggedInUser) {
                setLoading(false);
                return;
            }

            const email = loggedInUser.email || '';
            if (!email.toLowerCase().endsWith('@iitgn.ac.in')) {
                throw new Error('Only official @iitgn.ac.in accounts are permitted to log in.');
            }

            setUser(buildLocalProfile(loggedInUser));

            // An interactive sign-in is the one moment the network is known to work,
            // so this one is awaited: it makes the admin tabs correct on first paint.
            await syncPermissionsInBackground(email, sessionRef.current);
        } catch (error) {
            await authService.logout();
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.logout();
            sessionRef.current++;
            // Shared reference data (bus timings, outlets) is deliberately kept: it
            // isn't the user's, and re-downloading it on the next login is wasteful.
            removeCacheByPrefix(USER_SCOPED_PREFIX);
            setUser(null);
            setIsGuest(false);
        } finally {
            setLoading(false);
        }
    };

    // onAuthStateChanged sets isGuest once the anonymous session lands.
    const continueAsGuest = async () => {
        setLoading(true);
        try {
            await authService.loginAnonymously();
        } catch (error) {
            console.error('Failed to start a guest session:', error);
            setLoading(false);
            throw error;
        }
    };

    const exitGuestMode = async () => {
        await signOut();
    };

    // Memoised on the email alone: a permissions sync calls setUser, so an identity
    // that changed every render would make any effect depending on this re-fire in a
    // loop. The email is what actually decides whose permissions get fetched.
    const refreshPermissions = useCallback(async () => {
        const email = user?.email;
        if (!email) return;
        await syncPermissionsInBackground(email, sessionRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    // Guests hold no permissions: every write route on the backend requires a
    // Firebase token, so nothing gated by this could succeed anyway.
    const hasPermission = (permissionKey: keyof AppPermissions): boolean => {
        return !!user && user.permissions?.[permissionKey] === true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isGuest,
                loading,
                signIn,
                signOut,
                continueAsGuest,
                exitGuestMode,
                hasPermission,
                refreshPermissions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
