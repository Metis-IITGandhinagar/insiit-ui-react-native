// src/core/auth/useAuthGate.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from './useAuth';

/**
 * Guard for anything that needs a signed-in user.
 *
 * Every write route on the backend (and GET /admin/permissions) requires a Firebase
 * ID token, so a guest attempting one would get a 403. Call `ensureSignedIn()` before
 * starting such an action: it prompts the guest to sign in and returns false, so the
 * action is abandoned rather than failing at the network layer.
 *
 *     if (!ensureSignedIn('report a lost item')) return;
 */
export const useAuthGate = () => {
    const { user, isGuest } = useAuth();
    const navigation = useNavigation<any>();

    const ensureSignedIn = useCallback(
        (action = 'do this'): boolean => {
            if (user) return true;

            Alert.alert(
                'Sign in required',
                `Sign in with your IITGN account to ${action}.`,
                [
                    { text: 'Not now', style: 'cancel' },
                    { text: 'Sign in', onPress: () => navigation.navigate('Login') },
                ]
            );
            return false;
        },
        [user, navigation]
    );

    return { isGuest, isSignedIn: !!user, ensureSignedIn };
};
