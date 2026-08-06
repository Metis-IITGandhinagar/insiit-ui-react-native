// src/features/lostfound/services/lostFoundService.ts
import { apiClient } from '@/core/api/apiClient';

/** Mirrors `LostFoundStatus` (serde renames to snake_case). */
export type LostFoundStatus = 'lost' | 'found' | 'claimed_to_be_found';

export interface LostFoundClaim {
    id: number;
    item_name: string;
    claimed_by_email: string;
    remarks: string;
    /** Unix seconds — see backendTime.ts. */
    claim_timestamp: number;
}

/** Mirrors `LostFoundEntry` in the backend (src/schemas/lost_found_schemas.rs). */
export interface LostFoundEntry {
    id: number;
    item_name: string;
    description: string;
    added_on_timestamp: number;
    added_by_email: string;
    status: LostFoundStatus;
    found_claims: LostFoundClaim[];
    img_urls: string[];
}

export interface LostFoundRequest {
    item_name: string;
    description: string;
    /** Raw base64 payloads; the backend saves them and returns img_urls. */
    base64_images: string[];
}

export const lostFoundService = {
    getAll: async (): Promise<LostFoundEntry[]> => {
        const response = await apiClient.get<LostFoundEntry[]>('/lost-found');
        return Array.isArray(response.data) ? response.data : [];
    },

    report: async (payload: LostFoundRequest): Promise<LostFoundEntry> => {
        const response = await apiClient.post<LostFoundEntry>('/lost-found', payload);
        return response.data;
    },

    /**
     * Author only. NOTE: the backend's `edit_lost_found` updates item_name and
     * description only — `base64_images` in the body is ignored, so existing photos
     * can't be replaced or removed through this endpoint.
     */
    edit: async (id: number, payload: LostFoundRequest): Promise<LostFoundEntry> => {
        const response = await apiClient.put<LostFoundEntry>(`/lost-found/${id}`, payload);
        return response.data;
    },

    /** Author only — the backend scopes this by added_by_email. */
    markFound: async (entry: LostFoundEntry): Promise<LostFoundEntry> => {
        const response = await apiClient.put<LostFoundEntry>('/lost-found/mark-found', entry);
        return response.data;
    },

    /** Tell the owner you think you've found their item. */
    claimFound: async (entry: LostFoundEntry, remarks: string): Promise<LostFoundEntry> => {
        const response = await apiClient.post<LostFoundEntry>('/lost-found/claim-found', {
            id: entry.id,
            item_name: entry.item_name,
            remarks,
        });
        return response.data;
    },

    remove: async (id: number): Promise<void> => {
        await apiClient.delete(`/lost-found/${id}`);
    },
};
