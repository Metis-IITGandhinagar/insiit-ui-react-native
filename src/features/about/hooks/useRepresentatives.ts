import { CACHE_POLICIES, useCachedResource } from '@/core/cache';
import { Representative, representativesService } from '../services/representativesService';

const fetchRepresentatives = () => representativesService.getAll();

export const useRepresentatives = () => {
    // The council changes once an academic year, so a cached copy is almost always
    // current — and these are the contacts someone is most likely to need in a hurry,
    // signal or not.
    const { data, loading, refreshing, error, usingCachedData, lastUpdatedAt, refresh } =
        useCachedResource<Representative[]>({
            policy: CACHE_POLICIES.representatives,
            fetcher: fetchRepresentatives,
        });

    return {
        representatives: data ?? [],
        loading,
        refreshing,
        error: error ? 'Failed to load the student council' : null,
        usingCachedData,
        lastUpdatedAt,
        refresh,
    };
};
