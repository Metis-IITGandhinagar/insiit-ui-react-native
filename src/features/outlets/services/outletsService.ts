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
    /** See backendTime.ts — currently unannotated server-side. */
    open_time: string | number | number[];
    close_time: string | number | number[];
    menu: OutletMenuEntry[];
    image_url: string | null;
}

export const outletsService = {
    getAll: async (): Promise<Outlet[]> => {
        const response = await apiClient.get<Outlet[]>('/outlets');
        return Array.isArray(response.data) ? response.data : [];
    },
};
