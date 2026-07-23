import { apiClient } from '@core/api/apiClient';

export interface AdminPermissions {
    post_event: boolean;
    edit_event: boolean;
    delete_event: boolean;
    post_announcement: boolean;
    edit_announcement: boolean;
    delete_announcement: boolean;
    post_mess_menu: boolean;
    manage_users: boolean;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role?: string;
    permissions: AdminPermissions;
    createdAt: string;
}

export interface CreateAdminPayload {
    email: string;
    name: string;
    permissions: Partial<AdminPermissions>;
}

export interface UpdatePermissionsPayload {
    permissions: Partial<AdminPermissions>;
}

class AdminService {
    async fetchPermissions(): Promise<AdminPermissions> {
        const response = await apiClient.get<AdminPermissions>('/admin/permissions');
        return response.data;
    }

    async fetchAdmins(): Promise<AdminUser[]> {
        const response = await apiClient.get<AdminUser[]>('/admin/users');
        return response.data;
    }

    async createAdmin(payload: CreateAdminPayload): Promise<AdminUser> {
        const response = await apiClient.post<AdminUser>('/admin/users', payload);
        return response.data;
    }

    async updatePermissions(adminId: string, payload: UpdatePermissionsPayload): Promise<AdminUser> {
        const response = await apiClient.patch<AdminUser>(`/admin/users/${adminId}/permissions`, payload);
        return response.data;
    }

    async deleteEvent(eventId: string): Promise<void> {
        await apiClient.delete(`/events/${eventId}`);
    }

    async deleteAnnouncement(announcementId: string): Promise<void> {
        await apiClient.delete(`/announcements/${announcementId}`);
    }

    async deleteAdmin(adminId: string): Promise<void> {
        await apiClient.delete(`/admin/users/${adminId}`);
    }
}

export const adminService = new AdminService();