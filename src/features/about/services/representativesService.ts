import { apiClient } from '@/core/api/apiClient';

/** Mirrors the `/representatives` row returned by the backend. */
export interface Representative {
    id: number;
    name: string;
    position: string;
    email: string;
    /** Dialling-code form as stored, e.g. "+91 9173606682". */
    phone: string;
}

export const representativesService = {
    getAll: async (): Promise<Representative[]> => {
        const response = await apiClient.get<Representative[]>('/representatives');
        return Array.isArray(response.data) ? response.data : [];
    },
};
