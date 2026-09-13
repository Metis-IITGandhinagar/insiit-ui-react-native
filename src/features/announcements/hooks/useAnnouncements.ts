import { CACHE_POLICIES, useCachedResource } from '@/core/cache';
import { AnnouncementEntry, announcementsService } from '../services/announcementsService';

const fetchAnnouncements = () => announcementsService.getAll();

export const useAnnouncements = () => {
    // Cached so a notice someone read this morning is still readable in a basement
    // lecture hall. The service already sorts newest-first before it's stored.
    const { data, loading, refreshing, error, usingCachedData, lastUpdatedAt, refresh } =
        useCachedResource<AnnouncementEntry[]>({
            policy: CACHE_POLICIES.announcements,
            fetcher: fetchAnnouncements,
        });

    return {
        announcements: data ?? [],
        loading,
        refreshing,
        error,
        usingCachedData,
        lastUpdatedAt,
        refresh,
    };
};
