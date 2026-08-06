// src/services/api/apiClient.ts
import axios from 'axios';
import { authService } from '../auth/authService';

export const BASE_URL = "https://insiit-api-rust.metis-iitgn.tech";

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
    timeout: 10000,
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