// src/features/outlets/services/outletsService.ts
import { apiClient } from '@/core/api/apiClient';

/** Mirrors `Outlet` in the backend (src/schemas/outlets_schemas.rs). */
export interface OutletMenuEntry {
    name: string;
    price: number;
}

export interface Outlet {
    id: number;
    name: string;
    description: string | null;
    location: { latitude: number; longitude: number };
    landmark: string | null;
    /** RFC 3339 string — see backendTime.ts. */
    open_time: string;
    close_time: string;
    menu: OutletMenuEntry[];
    image_url: string | null;
}

export const outletsService = {
    getAll: async (): Promise<Outlet[]> => {
        const response = await apiClient.get<Outlet[]>('/outlets');
        return Array.isArray(response.data) ? response.data : [];
    },
};
