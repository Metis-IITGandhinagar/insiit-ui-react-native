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
    if (/^(?:https?:\/\/|data:|file:|content:)/i.test(path)) return path;
    return `${BASE_URL}/${path.replace(/^\/+/, '')}`;
};

/**
 * Reads should fail fast: every one of them has a cached copy to fall back on, so a
 * long wait buys nothing a stale render doesn't already give. A minute of spinner on
 * dead campus wifi was strictly worse than showing yesterday's data immediately.
 */
export const READ_TIMEOUT_MS = 12000;

/**
 * Writes get the old generous budget, because posts carry images inline as base64 and
 * 10s was not enough to upload a photo on campus wifi — axios surfaces the abort as a
 * bare "Network Error", and a half-uploaded listing can't be retried from cache.
 */
export const WRITE_TIMEOUT_MS = 60000;

const READ_METHODS = new Set(['get', 'head', 'options']);

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: READ_TIMEOUT_MS,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        // Raise the budget for uploads, leaving any per-call override untouched.
        if (config.timeout === READ_TIMEOUT_MS && !READ_METHODS.has((config.method ?? 'get').toLowerCase())) {
            config.timeout = WRITE_TIMEOUT_MS;
        }

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