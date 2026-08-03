// src/services/api/userService.ts
import { apiClient } from './apiClient';
import { AppPermissions } from '../navigation/types';

    export interface AdminEntryResponse {
        email: string;
        permissions: AppPermissions;
    }

    export const userService = {
        fetchUserPermissions: async (): Promise<AppPermissions | null> => {
            try {
                const response = await apiClient.get<AdminEntryResponse>('/admin/permissions');
                return response.data.permissions;
            } catch (error: any) {
                if (error.response && (error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
                    // User is not an admin or server error - this is expected
                    return null;
                }

                console.error('Network or server error fetching permissions:', error);
                return null;
            }
        },
    };