import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { nativeAuth } from '../auth/firebase';
import { authService } from '../auth/authService';
import { userService } from '../api/userService';
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
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_STUDENT_PERMISSIONS: AppPermissions = NO_PERMISSIONS;

async function buildProfile(firebaseUser: any): Promise<UserSessionProfile> {
    const backendPermissions = await userService.fetchUserPermissions();

    const providerData = firebaseUser.providerData?.[0] || {};
    const email = firebaseUser.email || providerData.email || '';
    const displayName = firebaseUser.displayName || providerData.displayName || 'IITGN Student';
    const photoURL = firebaseUser.photoURL || providerData.photoURL || null;

    return {
        email,
        displayName,
        photoURL,
        permissions: backendPermissions || DEFAULT_STUDENT_PERMISSIONS,
    };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSessionProfile | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = nativeAuth.onAuthStateChanged(async (firebaseUser) => {
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

                const profile = await buildProfile(firebaseUser);
                setUser(profile);
                setIsGuest(false);
            } catch (error) {
                console.error('Failed to restore session on boot:', error);
                await authService.logout();
                setUser(null);
                setIsGuest(false);
            } finally {
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

            const profile = await buildProfile(loggedInUser);
            setUser(profile);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};