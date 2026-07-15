// src/services/api/apiClient.ts
import axios from 'axios';
import { authService } from '../auth/authService';

// REPLACE THIS with your actual local network machine IP address or deployed backend URL.
// Note: Android emulators read your local machine localhost at http://10.0.2.2:8080
const BASE_URL = 'http://10.0.2.2:8080/api';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios Request Interceptor automatically injects the live Firebase ID Token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Fetch the active user's structural ID token string
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