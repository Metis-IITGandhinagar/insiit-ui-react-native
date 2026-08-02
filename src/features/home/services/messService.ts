import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessMenuResponse, UserSession } from "./messTypes";

const BASE_URL = "https://insiit-api-rust.metis-iitgn.tech";

const CACHE_KEY_MENU = "@insiit:cached_mess_menu";
const CACHE_KEY_SESSION = "@insiit:auth_session";

export const messService = {
    async getCachedMenu(): Promise<MessMenuResponse | null> {
        const cached = await AsyncStorage.getItem(CACHE_KEY_MENU);
        return cached ? JSON.parse(cached) : null;
    },

    async fetchAndSyncMenu(currentCachedId?: string): Promise<MessMenuResponse> {
        try {
            const response = await fetch(`${BASE_URL}/mess-menu`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Backend server error");

            const rawArray = await response.json();

            const serverData: MessMenuResponse = {
                id: new Date().toDateString(), 
                mess_name: "Hostel Mess",
                mess: rawArray.map((entry: any) => ({
                    day: entry.day,
                    breakfast: entry.breakfast.join("\n"),
                    lunch: entry.lunch.join("\n"),
                    snacks: entry.snacks.join("\n"),
                    dinner: entry.dinner.join("\n")
                }))
            };

            if (!currentCachedId || serverData.id !== currentCachedId) {
                await AsyncStorage.setItem(CACHE_KEY_MENU, JSON.stringify(serverData));
            }
            return serverData;
        } catch (error) {
            console.warn("Failed background update. Using offline data copy.", error);
            const cached = await AsyncStorage.getItem(CACHE_KEY_MENU);
            if (cached) return JSON.parse(cached);
            throw error;
        }
    },

    async saveSession(studentId: string, qrToken: string): Promise<UserSession> {
        const session: UserSession = { studentId, qrToken };
        await AsyncStorage.setItem(CACHE_KEY_SESSION, JSON.stringify(session));
        return session;
    },

    async getSession(): Promise<UserSession | null> {
        const session = await AsyncStorage.getItem(CACHE_KEY_SESSION);
        return session ? JSON.parse(session) : null;
    },

    async terminateSession(): Promise<void> {
        await AsyncStorage.removeItem(CACHE_KEY_SESSION);
    }
};