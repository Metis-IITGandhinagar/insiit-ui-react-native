import { apiClient } from "./apiClient";

export interface Representative {
    id: string;
    name: string;
    designation: string;
    email: string;
    phone: string;
    department?: string;
}

export const representativeService = {
    getAllRepresentatives: async (): Promise<Representative[]> => {
        // This targets: https://insiit-api.metis-iitgn.tech/api/representatives
        const response = await apiClient.get<Representative[]>("/representatives");
        return response.data;
    },
};