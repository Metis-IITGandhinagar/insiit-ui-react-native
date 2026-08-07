import { apiClient } from '@core/api/apiClient';
import { ApiBusResponse, CreateBusPayload } from "./busTypes";

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

    createBus: async (busData: CreateBusPayload): Promise<ApiBusResponse> => {
        try {
            const response = await apiClient.post<ApiBusResponse>('/buses', busData);
            return response.data;
        } catch (error) {
            console.error("Network POST Exception:", error);
            throw error;
        }
    }
};

/**
 * Minutes past midnight for a `HH:MM:SS` departure, or null if it doesn't parse.
 *
 * The backend stores departures in a Postgres `TIME` column and serialises them via
 * `::text`, so the format is guaranteed — no AM/PM string surgery, and no silent
 * fallback: an unparseable value returns null so callers can drop the row instead of
 * treating it as "departing now".
 */
export const parseDepartureMinutes = (timeStr: string): number | null => {
    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(timeStr?.trim() ?? '');
    if (!match) return null;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;

    return hours * 60 + minutes;
};

/** Minutes until the departure today. Negative once it has passed. */
export const calculateMinutesLeft = (timeStr: string): number | null => {
    const departure = parseDepartureMinutes(timeStr);
    if (departure === null) return null;

    const now = new Date();
    return departure - (now.getHours() * 60 + now.getMinutes());
};

/** `"07:30:00"` -> `"7:30 AM"`, for display only. */
export const formatDepartureTime = (timeStr: string): string => {
    const departure = parseDepartureMinutes(timeStr);
    if (departure === null) return timeStr ?? '';

    const hours24 = Math.floor(departure / 60);
    const minutes = departure % 60;
    const meridiem = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    return `${hours12}:${String(minutes).padStart(2, '0')} ${meridiem}`;
};