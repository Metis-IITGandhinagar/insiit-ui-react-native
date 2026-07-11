import { useState, useEffect, useCallback } from "react";
import { Event } from "../types";
import { eventService } from "./eventService";

export const useEventData = () => {
    const [eventsList, setEventsList] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refreshEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await eventService.getAllEvents();
            setEventsList(data);
        } catch (err: any) {
            setError(err.message || "Failed to sync campus events");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshEvents();
    }, [refreshEvents]);

    return {
        eventsList,
        loading,
        error,
        refreshEvents,
    };
};