import { create } from 'zustand';

type UserType = 'guest' | 'student';

interface User {
    name: string;
    email: string;
    photoUrl?: string;
}

interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    userType: UserType | null;
    user: User | null;

    login: (user: User) => void;
    continueAsGuest: () => void;
    logout: () => void;
    finishLoading: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoading: false,

    isAuthenticated: false,

    userType: null,

    user: null,

    login: (user) =>
        set({
            isAuthenticated: true,
            userType: 'student',
            user,
        }),

    continueAsGuest: () =>
        set({
            isAuthenticated: false,
            userType: 'guest',
            user: null,
        }),

    logout: () =>
        set({
            isAuthenticated: false,
            userType: null,
            user: null,
        }),

    finishLoading: () =>
        set({
            isLoading: false,
        }),
}));