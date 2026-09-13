import { useCallback } from "react";
import { CACHE_POLICIES, useCachedResource } from "@/core/cache";
import { Event } from "../services/searchTypes";
import { eventService } from "../services/eventService";

const fetchEvents = () => eventService.getAllEvents();

export const useEventData = () => {
    // Events are already mapped to the UI shape before caching, so a cold start
    // renders them without re-parsing backend timestamps.
    const { data, loading, refreshing, error, usingCachedData, lastUpdatedAt, refresh } =
        useCachedResource<Event[]>({
            policy: CACHE_POLICIES.events,
            fetcher: fetchEvents,
        });

    const refreshEvents = useCallback(() => refresh(), [refresh]);

    return {
        eventsList: data ?? [],
        loading,
        refreshing,
        error: error ? "Failed to sync campus events" : null,
        usingCachedData,
        lastUpdatedAt,
        refreshEvents,
    };
};
