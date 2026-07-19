// src/services/api/apiClient.ts
import axios from 'axios';
import { authService } from '../auth/authService';

const BASE_URL = "https://insiit-api.metis-iitgn.tech/api";

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