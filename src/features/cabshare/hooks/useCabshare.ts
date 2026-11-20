import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { CACHE_POLICIES } from '@/core/cache/cacheKeys';
import { useCachedResource } from '@/core/cache/useCachedResource';
import { cabshareError, cabshareService } from '../services/cabshareService';
import type { Catalogue } from '../services/cabshareTypes';

/**
 * Fetch now, then again every `everyMs` while the screen is focused and the app is
 * in front. Rides fill up, fares move when someone joins and chat arrives, so the
 * cab screens keep themselves current instead of asking riders to pull to refresh.
 */
export function usePolled<T>(fetcher: () => Promise<T>, everyMs: number, enabled = true) {
    const focused = useIsFocused();
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fetchRef = useRef(fetcher);
    fetchRef.current = fetcher;
    const inFlight = useRef(false);

    const load = useCallback(async (manual = false) => {
        if (inFlight.current) return;
        inFlight.current = true;
        if (manual) setRefreshing(true);
        try {
            setData(await fetchRef.current());
            setError(null);
        } catch (e) {
            setError(cabshareError(e, 'Could not load cabshare. Pull to try again.'));
        } finally {
            inFlight.current = false;
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled || !focused) return;
        void load();
        let active = AppState.currentState === 'active';
        const sub = AppState.addEventListener('change', (state) => {
            const wasActive = active;
            active = state === 'active';
            if (active && !wasActive) void load();
        });
        const timer = setInterval(() => {
            if (active) void load();
        }, everyMs);
        return () => {
            clearInterval(timer);
            sub.remove();
        };
    }, [enabled, focused, everyMs, load]);

    const refresh = useCallback(() => load(true), [load]);
    return { data, setData, error, loading: loading && enabled, refreshing, refresh };
}

/** Stops, vehicles and rate cards. Cached on disk: they only change with a release. */
export function useCatalogue() {
    return useCachedResource<Catalogue>({
        policy: CACHE_POLICIES.cabshareCatalogue,
        fetcher: () => cabshareService.catalogue(),
    });
}
