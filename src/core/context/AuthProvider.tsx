import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { nativeAuth } from '../auth/firebase';
import { authService } from '../auth/authService';
import { userService } from '../api/userService';
import { UserSessionProfile, AppPermissions } from '../navigation/types';

interface AuthContextType {
    user: UserSessionProfile | null;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    hasPermission: (permissionKey: keyof AppPermissions) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_STUDENT_PERMISSIONS: AppPermissions = {
    get_admin: false, post_admin: false, put_admin: false,
    post_bus_schedule: false, put_bus_schedule: false,
    post_event: false, delete_event: false, put_event: false,
    post_mess_menu: false, post_outlet: false, delete_outlet: false, put_outlet: false
};

async function buildProfile(firebaseUser: any): Promise<UserSessionProfile> {
    const backendPermissions = await userService.fetchUserPermissions();
    const isStudent = !backendPermissions;

    const providerData = firebaseUser.providerData?.[0] || {};
    const email = firebaseUser.email || providerData.email || '';
    const displayName = firebaseUser.displayName || providerData.displayName || 'IITGN Student';
    const photoURL = firebaseUser.photoURL || providerData.photoURL || null;

    return {
        email,
        displayName,
        photoURL,
        role: isStudent ? 'student' : 'admin',
        permissions: backendPermissions || DEFAULT_STUDENT_PERMISSIONS,
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

                    const profile = await buildProfile(firebaseUser);
                    setUser(profile);
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