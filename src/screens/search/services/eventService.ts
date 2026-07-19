import { apiClient } from '@/core/api/apiClient';
import { Event } from "../types";

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
                event_name: eventData.title,
                location: eventData.venue,
                date: eventData.date,
                start_time: eventData.time,
                poster_image_url: eventData.image,
                description: eventData.description,
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