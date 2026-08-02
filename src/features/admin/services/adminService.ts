import { apiClient } from '@core/api/apiClient';
import { AppPermissions } from '@/core/navigation/types';
import { AdminEntryResponse } from '@/core/api/userService';

export type AdminPermissions = AppPermissions;

export interface AdminUser {
    email: string;
    permissions: AdminPermissions;
}

export interface CreateAdminPayload {
    email: string;
    permissions: Partial<AdminPermissions>;
}

export interface UpdatePermissionsPayload {
    permissions: Partial<AdminPermissions>;
}

class AdminService {
    async fetchPermissions(): Promise<AdminPermissions> {
        const response = await apiClient.get<AdminEntryResponse>('/admin/permissions');
        return response.data.permissions;
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