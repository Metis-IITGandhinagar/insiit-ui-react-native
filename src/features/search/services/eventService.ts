import { apiClient, resolveBackendAsset } from '@/core/api/apiClient';
import { parseBackendInstant, toBackendTimestamp } from '@/core/api/backendTime';
import { Event } from "./searchTypes";

/** `YYYY-MM-DD` + `HH:MM AM/PM` -> Date, without relying on engine-specific parsing. */
export const parseEventDateTime = (date: string, time: string): Date | null => {
    const dateMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim());
    if (!dateMatch) return null;

    const [, year, month, day] = dateMatch;

    // Time is optional; midnight is a reasonable default.
    let hours = 0;
    let minutes = 0;
    if (time.trim()) {
        const timeMatch = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/.exec(time.trim());
        if (!timeMatch) return null;

        hours = Number(timeMatch[1]);
        minutes = Number(timeMatch[2]);
        const meridiem = timeMatch[3]?.toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
    }

    const parsed = new Date(Number(year), Number(month) - 1, Number(day), hours, minutes);
    return isNaN(parsed.getTime()) ? null : parsed;
};

/** Splits an ISO instant back into the form fields, for prefilling an edit. */
export const splitEventDateTime = (iso?: string): { date: string; time: string } => {
    if (!iso) return { date: '', time: '' };
    const parsed = new Date(iso);
    if (isNaN(parsed.getTime())) return { date: '', time: '' };

    const pad = (value: number) => String(value).padStart(2, '0');
    const hours24 = parsed.getHours();
    const meridiem = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    return {
        date: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
        time: `${pad(hours12)}:${pad(parsed.getMinutes())} ${meridiem}`,
    };
};

export const mapApiEventToUi = (event: any, fallbackIndex: number): Event => {
    const start = parseBackendInstant(event.start_datetime);
    const isValidStart = start !== null;

    return {
        id: String(event.id ?? `fallback-${fallbackIndex}`),
        title: event.name ?? "",
        venue: event.address ?? "",
        date: isValidStart ? start!.toLocaleDateString() : "",
        time: isValidStart
            ? start!.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "",
        // Kept raw so an edit can round-trip the exact instant instead of re-parsing
        // the localised strings above.
        startDateTime: isValidStart ? start!.toISOString() : undefined,
        addedByEmail: event.added_by_email ?? undefined,
        // poster_url is a relative path from the backend's save_image.
        image:
            resolveBackendAsset(event.poster_url) ??
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
        description: event.description ?? "",
        isBookmarked: false,
    };
};

type EventFormData = Omit<Event, 'id' | 'isBookmarked'>;

/**
 * `image` is either a data URI from the picker (uploaded as poster_base64) or an
 * already-hosted URL. The backend can only accept base64, and its edit handler does
 * `COALESCE($3, poster_url)`, so sending null on edit keeps the existing poster.
 */
const buildPayload = (eventData: EventFormData) => {
    const start = parseEventDateTime(eventData.date, eventData.time);
    if (!start) {
        throw new Error('Enter the date as YYYY-MM-DD and the time as HH:MM AM/PM.');
    }

    const isNewUpload = eventData.image?.startsWith('data:');

    return {
        name: eventData.title,
        description: eventData.description || null,
        poster_base64: isNewUpload ? eventData.image : null,
        address: eventData.venue || null,
        // RFC 3339, matching time::serde::rfc3339 on the Rust side.
        start_datetime: toBackendTimestamp(start),
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

    addEvent: async (eventData: EventFormData): Promise<Event> => {
        try {
            const response = await apiClient.post('/events', buildPayload(eventData));
            return mapApiEventToUi(response.data, 0);
        } catch (error) {
            console.error("Network POST Exception:", error);
            throw error;
        }
    },

    /** Author only — the backend scopes the update by added_by_email. */
    updateEvent: async (id: string, eventData: EventFormData): Promise<Event> => {
        try {
            const response = await apiClient.put(`/events/${id}`, buildPayload(eventData));
            return mapApiEventToUi(response.data, 0);
        } catch (error) {
            console.error("Network PUT Exception:", error);
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
