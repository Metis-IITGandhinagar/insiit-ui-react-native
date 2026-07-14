import { ApiEventResponse, Event } from "../types";

const BASE_URL = "https://insiit-api.metis-iitgn.tech/api";

const METIS_API_KEY = "metis-at-insiit";

export const mapApiEventToUi = (event: any, fallbackIndex: number): Event => ({
    id: String(event.id || event._id || `fallback-key-${fallbackIndex}`),
    title: event.event_name || "",
    venue: event.location || "",
    date: event.date || "",
    time: event.start_time || "",
    image: event.poster_image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
    description: event.description || "",
    isBookmarked: false,
});

export const eventService = {
    getAllEvents: async (): Promise<Event[]> => {
        try {
            const response = await fetch(`${BASE_URL}/events`);
            if (!response.ok) {
                throw new Error("Failed to fetch event feed");
            }
            const data = await response.json();
            return Array.isArray(data) ? data.map((item, index) => mapApiEventToUi(item, index)) : [];
        } catch (error) {
            console.error("Network Fetch Exception:", error);
            throw error;
        }
    },

    addEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
        try {
            const payload = {
                event_name: eventData.title,
                location: eventData.venue,
                date: eventData.date,
                start_time: eventData.time,
                poster_image_url: eventData.image,
                description: eventData.description,
                added_by: "janil.jain@iitgn.ac.in",
            };

            const response = await fetch(`${BASE_URL}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "x-api-key": METIS_API_KEY
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Backend Error (${response.status}):`, errorText);
                throw new Error(`Server rejected request: ${response.status}`);
            }

            const data = await response.json();
            return mapApiEventToUi(data, Date.now());
        } catch (error) {
            console.error("Network POST Exception:", error);
            throw error;
        }
    },

    deleteEvent: async (id: string): Promise<boolean> => {
        try {
            const response = await fetch(`${BASE_URL}/events/${id}`, {
                method: "DELETE",
                headers: {
                    "x-api-key": METIS_API_KEY
                }
            });
            return response.ok;
        } catch (error) {
            console.error("Network DELETE Exception:", error);
            throw error;
        }
    }
};