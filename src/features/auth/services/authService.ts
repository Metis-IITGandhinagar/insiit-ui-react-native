import { AuthState } from "../types";

export const authService = {
    async loginWithGoogle(): Promise<AuthState> {
        throw new Error("Not implemented");
    },

    async continueAsGuest(): Promise<AuthState> {
        throw new Error("Not implemented");
    },

    async logout(): Promise<void> {
        throw new Error("Not implemented");
    },
};