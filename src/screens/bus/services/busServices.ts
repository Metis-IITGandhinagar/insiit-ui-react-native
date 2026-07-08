import { ApiBusResponse } from "./busTypes";

const BASE_URL = "https://insiit-backend-node.vercel.app/api";

export const busService = {
    getAllBuses: async (): Promise<ApiBusResponse[]> => {
        try {
            const response = await fetch(`${BASE_URL}/buses`);
            if (!response.ok) {
                throw new Error("Failed to fetch bus schedules");
            }
            return await response.json();
        } catch (error) {
            console.error("Network Fetch Exception:", error);
            throw error;
        }
    }
};

/**
 * Calculates absolute delta minutes relative to current device time
 */
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