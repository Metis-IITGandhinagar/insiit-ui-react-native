// src/features/announcements/services/announcementsService.ts
import { apiClient } from '@/core/api/apiClient';

/** Mirrors `AnnouncementEntry` in the backend (src/schemas/announcements_schemas.rs). */
export interface AnnouncementEntry {
    id: number;
    title: string;
    description: string;
    /** Unix seconds — see backendTime.ts. */
    added_on_timestamp: number;
    added_by_email: string;
    img_url: string | null;
}

export const announcementsService = {
    getAll: async (): Promise<AnnouncementEntry[]> => {
        const response = await apiClient.get<AnnouncementEntry[]>('/announcements');
        if (!Array.isArray(response.data)) return [];
        // Newest first — the backend returns table order.
        return [...response.data].sort(
            (a, b) => (b.added_on_timestamp ?? 0) - (a.added_on_timestamp ?? 0)
        );
    },
};
