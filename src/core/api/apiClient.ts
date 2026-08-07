// src/services/api/apiClient.ts
import axios from 'axios';
import { authService } from '../auth/authService';

// Referenced as a static `process.env.X` property so Expo inlines it at bundle time.
// Presence is checked once at startup by core/config/checkEnv.ts.
export const BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL as string).replace(/\/+$/, '');

/**
 * The backend's `save_image` returns a RELATIVE path ("images/1786…-0"), served by
 * `ServeDir` at `/images`. Anything rendered in an <Image> has to go through here.
 * Absolute URLs are passed through, so older rows with full URLs still work.
 */
export const resolveBackendAsset = (path?: string | null): string | undefined => {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;
    return `${BASE_URL}/${path.replace(/^\/+/, '')}`;
};

export const apiClient = axios.create({
    baseURL: BASE_URL,
    // Generous because posts carry images inline as base64 — 10s was not enough to
    // upload a photo on campus wifi, and axios surfaces the abort as "Network Error".
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await authService.getIdToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching Firebase ID Token for network request header:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);