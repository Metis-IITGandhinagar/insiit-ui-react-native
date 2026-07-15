// src/services/api/userService.ts
import { apiClient } from './apiClient';

// Add the exact structure here
export interface BackendProfileResponse {
    email: string;
    role: 'student' | 'admin' | 'staff';
    permissions: {
        post_event: boolean;
        delete_event: boolean;
        put_bus_schedule: boolean;
    };
}

export const userService = {
    verifySessionWithBackend: async (): Promise<BackendProfileResponse> => {
        const response = await apiClient.get<BackendProfileResponse>('/auth/verify');
        return response.data;
    },
};