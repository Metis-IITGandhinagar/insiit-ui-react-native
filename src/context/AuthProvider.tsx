// src/context/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { nativeAuth } from '../services/auth/firebase';
import { authService } from '../services/auth/authService';
import { UserSessionProfile, AppPermissions } from '../navigation/types';

interface AuthContextType {
    user: UserSessionProfile | null;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    hasPermission: (permissionKey: keyof AppPermissions) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TODO(backend): once the Rust backend has a /auth/verify (or similar) endpoint,
// replace this with a real call — e.g. userService.verifySessionWithBackend() —
// that sends the Firebase ID token and returns { role, permissions } from the server.
// Until then, every allowed (@iitgn.ac.in) user gets this default local profile.
const DEFAULT_PERMISSIONS: AppPermissions = {
    post_event: false,
    delete_event: false,
    put_bus_schedule: false,
};

function buildLocalProfile(email: string): UserSessionProfile {
    return {
        email,
        role: 'student',
        permissions: DEFAULT_PERMISSIONS,
    };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSessionProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = nativeAuth.onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const email = firebaseUser.email || '';
                    if (!email.toLowerCase().endsWith('@iitgn.ac.in')) {
                        await authService.logout();
                        setUser(null);
                        return;
                    }

                    setUser(buildLocalProfile(email));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to restore session on boot:', error);
                await authService.logout();
                setUser(null);
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
                // User cancelled the Google account picker — not a real error
                setLoading(false);
                return;
            }

            const email = loggedInUser.email || '';
            // authService.login() already enforces this and signs out if it fails,
            // but we still guard here in case that ever changes upstream.
            if (!email.toLowerCase().endsWith('@iitgn.ac.in')) {
                throw new Error('Only official @iitgn.ac.in accounts are permitted to log in.');
            }

            setUser(buildLocalProfile(email));
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
        } finally {
            setLoading(false);
        }
    };

    const hasPermission = (permissionKey: keyof AppPermissions): boolean => {
        return user?.permissions?.[permissionKey] === true;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};