import { apiClient } from '../../../services/api/apiClient';
import { ApiBusResponse } from "./busTypes";

export const busService = {
    getAllBuses: async (): Promise<ApiBusResponse[]> => {
        try {
            const response = await apiClient.get<ApiBusResponse[]>('/buses');
            return response.data;
        } catch (error) {
            console.error("Network Fetch Exception:", error);
            throw error;
        }
    },

    createBus: async (busData: Omit<ApiBusResponse, '_id' | '__v'>): Promise<ApiBusResponse> => {
        try {
            const response = await apiClient.post<ApiBusResponse>('/buses', busData);
            return response.data;
        } catch (error) {
            console.error("Network POST Exception:", error);
            throw error;
        }
    }
};

export const calculateMinutesLeft = (timeStr: string): number => {
    try {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const targetMinutes = hours * 60 + minutes;

        return targetMinutes - currentMinutes;
    } catch {
        return 0;
    }
};