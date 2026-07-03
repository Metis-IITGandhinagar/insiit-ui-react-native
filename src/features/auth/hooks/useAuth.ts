import { authService } from "../services/authService";

export function useAuth() {
    return {
        loginWithGoogle: authService.loginWithGoogle,
        continueAsGuest: authService.continueAsGuest,
        logout: authService.logout,
    };
}