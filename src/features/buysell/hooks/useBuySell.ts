import { backendInstantMs } from '@/core/api/backendTime';
import { CACHE_POLICIES, useCachedResource } from '@/core/cache';
import { BuySellEntry, buySellService } from '../services/buySellService';

/**
 * Sorted before caching, not after reading, so the stored copy is already in display
 * order and a cold start doesn't re-sort on the first frame.
 */
const fetchListings = async (): Promise<BuySellEntry[]> => {
    const data = await buySellService.getAll();

    // Newest first; the backend returns table order.
    return [...data].sort(
        (a, b) => backendInstantMs(b.added_on_timestamp) - backendInstantMs(a.added_on_timestamp)
    );
};

export const useBuySell = () => {
    // Listings go stale fast, but browsing yesterday's items offline is still far more
    // useful than an error — the short TTL just means it revalidates eagerly.
    const { data, loading, refreshing, error, usingCachedData, lastUpdatedAt, refresh } =
        useCachedResource<BuySellEntry[]>({
            policy: CACHE_POLICIES.buySell,
            fetcher: fetchListings,
        });

    return {
        entries: data ?? [],
        loading,
        refreshing,
        error,
        usingCachedData,
        lastUpdatedAt,
        refresh,
    };
};
