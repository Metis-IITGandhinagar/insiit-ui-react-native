import { apiClient } from '@core/api/apiClient';
import { AppPermissions, NO_PERMISSIONS } from '@/core/navigation/types';
import { AdminEntryResponse } from '@/core/api/userService';

export type AdminPermissions = AppPermissions;

export interface AdminUser {
    email: string;
    permissions: AdminPermissions;
}

// Not Partial: the backend deserializes into a struct where every permission is a
// required field, so a partial object is rejected with 422.
export interface CreateAdminPayload {
    email: string;
    permissions: AdminPermissions;
}

export interface UpdatePermissionsPayload {
    permissions: AdminPermissions;
}

class AdminService {
    async fetchPermissions(): Promise<AdminPermissions> {
        try {
            const response = await apiClient.get<AdminEntryResponse>('/admin/permissions');
            return response.data.permissions;
        } catch (error: any) {
            // Handle non-admin users gracefully (403/404) or server errors (500)
            if (error.response && (error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
                return { ...NO_PERMISSIONS };
            }
            throw error;
        }
    }

    async fetchAdmins(): Promise<AdminUser[]> {
        const response = await apiClient.get<AdminUser[]>('/admin');
        return response.data;
    }

    async createAdmin(payload: CreateAdminPayload): Promise<AdminUser> {
        const response = await apiClient.post<AdminUser>('/admin', payload);
        return response.data;
    }

    async deleteEvent(eventId: string): Promise<void> {
        await apiClient.delete(`/events/${eventId}`);
    }

    async deleteAnnouncement(announcementId: string): Promise<void> {
        await apiClient.delete(`/announcements/${announcementId}`);
    }

}

export const adminService = new AdminService();