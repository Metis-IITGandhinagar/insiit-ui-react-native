export type AuthProvider = "google" | "guest";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    provider: AuthProvider | null;
    user: User | null;
}