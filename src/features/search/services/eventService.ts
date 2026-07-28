import { apiClient } from '@/core/api/apiClient';
import { Event } from "./searchTypes";

export const mapApiEventToUi = (event: any, fallbackIndex: number): Event => {
    const start = new Date(event.start_datetime);

    return {
        id: String(event.id ?? `fallback-${fallbackIndex}`),
        title: event.name ?? "",
        venue: event.address ?? "",
        date: start.toLocaleDateString(),
        time: start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        image:
            event.poster_url ??
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
        description: event.description ?? "",
        isBookmarked: false,
    };
};

export const eventService = {
    getAllEvents: async (): Promise<Event[]> => {
        try {
            const response = await apiClient.get('/events');
            return Array.isArray(response.data) ? response.data.map((item, index) => mapApiEventToUi(item, index)) : [];
        } catch (error) {
            console.error("Network Fetch Exception:", error);
            throw error;
        }
    },

    addEvent: async (eventData: Omit<Event, 'id' | 'isBookmarked'>): Promise<Event> => {
        try {
            const payload = {
                name: eventData.title,
                description: eventData.description || null,
                poster_base64: eventData.image || null,
                address: eventData.venue || null,
                start_datetime: new Date(
                    `${eventData.date} ${eventData.time}`
                ).toISOString(),
            };

            const response = await apiClient.post('/events', payload);
            return mapApiEventToUi(response.data, Date.now());
        } catch (error) {
            console.error("Network POST Exception:", error);
            throw error;
        }
    },

    deleteEvent: async (id: string): Promise<boolean> => {
        try {
            const response = await apiClient.delete(`/events/${id}`);
            return response.status === 200 || response.status === 204;
        } catch (error) {
            console.error("Network DELETE Exception:", error);
            throw error;
        }
    }
};