import { useCallback, useEffect, useRef, useState } from "react";
import { CachePolicy } from "./cacheKeys";
import { readCache, writeCache } from "./persistentCache";

export interface UseCachedResourceOptions<T> {
    policy: CachePolicy;
    /** The network call. Must throw on failure so the cached copy is kept. */
    fetcher: () => Promise<T>;
    /**
     * Set false to hold off entirely — nothing is read, fetched, or written. Used for
     * resources that only make sense once a user is signed in.
     */
    enabled?: boolean;
    /**
     * Skip the background revalidate while the cached copy is still inside its TTL.
     * Worth it for near-static data (bus timings); wrong for anything time-sensitive.
     */
    revalidateWhenFresh?: boolean;
}

export interface UseCachedResourceResult<T> {
    data: T | null;
    /** First load with nothing to show. Never true when a cached copy exists. */
    loading: boolean;
    /** A fetch is in flight while cached content is already on screen. */
    refreshing: boolean;
    /**
     * Only set when there is nothing to display. A failed refresh over good cached
     * data reports through `usingCachedData` instead, so screens keep rendering.
     */
    error: string | null;
    /** The last fetch failed and the content on screen came off disk. */
    usingCachedData: boolean;
    /** Epoch ms the displayed data was fetched, or null if it never has been. */
    lastUpdatedAt: number | null;
    refresh: () => Promise<void>;
    /**
     * Replaces the data locally and writes through to disk. For optimistic updates
     * after a mutation, so the next cold start shows the change instead of reverting.
     */
    setData: (updater: T | ((previous: T | null) => T)) => void;
}

/**
 * Stale-while-revalidate over the disk cache.
 *
 * The cached copy is read synchronously during the first render, so a screen with a
 * warm cache shows real content on frame one and never flashes a spinner. The network
 * fetch then runs in the background and swaps in fresher data if it succeeds. If it
 * fails — offline, campus wifi, backend down — the cached copy stays on screen and
 * `usingCachedData` goes true, instead of replacing readable content with an error.
 */
export function useCachedResource<T>({
    policy,
    fetcher,
    enabled = true,
    revalidateWhenFresh = true,
}: UseCachedResourceOptions<T>): UseCachedResourceResult<T> {
    // Read once, synchronously, before the first paint.
    const [seed] = useState(() =>
        enabled ? readCache<T>(policy.key, { version: policy.version, ttlMs: policy.ttlMs }) : null
    );
    // Tracks whether the synchronous seed above was skipped because the resource
    // started disabled; see the late-seed effect below.
    const seededRef = useRef(seed !== null || enabled);

    const [data, setDataState] = useState<T | null>(seed?.data ?? null);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(seed?.savedAt ?? null);
    const [loading, setLoading] = useState<boolean>(enabled && !seed);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [usingCachedData, setUsingCachedData] = useState<boolean>(false);

    // Guards a late response from a fetch whose screen has already been popped.
    const mountedRef = useRef(true);
    // Lets the fetch read current data without re-creating `refresh` on every change,
    // which would re-fire the mount effect in a loop.
    const dataRef = useRef<T | null>(data);
    dataRef.current = data;

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const fetchNow = useCallback(async () => {
        if (!enabled) return;

        const hasContent = dataRef.current !== null;
        if (hasContent) setRefreshing(true);
        else setLoading(true);

        try {
            const fresh = await fetcher();
            if (!mountedRef.current) return;

            writeCache(policy.key, fresh, { version: policy.version });
            setDataState(fresh);
            dataRef.current = fresh;
            setLastUpdatedAt(Date.now());
            setError(null);
            setUsingCachedData(false);
        } catch (err: any) {
            if (!mountedRef.current) return;

            // Keep whatever is already rendered. Only a screen with nothing to show
            // gets an error, because only there is an error more useful than the data.
            if (dataRef.current !== null) {
                setUsingCachedData(true);
            } else {
                setError(err?.message || "Couldn't reach the server");
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [enabled, fetcher, policy.key, policy.version]);

    /**
     * Seeds from disk for a resource that mounted disabled and was enabled later — the
     * synchronous read above only runs once, so without this such a resource would
     * show a spinner even with a perfectly good cached copy.
     */
    useEffect(() => {
        if (!enabled || seededRef.current) return;
        seededRef.current = true;

        const late = readCache<T>(policy.key, { version: policy.version, ttlMs: policy.ttlMs });
        if (!late) return;

        dataRef.current = late.data;
        setDataState(late.data);
        setLastUpdatedAt(late.savedAt);
        setLoading(false);
    }, [enabled, policy.key, policy.ttlMs, policy.version]);

    useEffect(() => {
        if (!enabled) return;
        // A cached copy inside its TTL is good enough for near-static data; skipping
        // the request saves a round-trip on every screen open.
        if (!revalidateWhenFresh && seed && !seed.stale) return;

        fetchNow();
    }, [enabled, fetchNow, revalidateWhenFresh, seed]);

    const setData = useCallback(
        (updater: T | ((previous: T | null) => T)) => {
            // Computed outside setDataState so the disk write isn't a side effect
            // inside a state updater, which React is free to run more than once.
            const next =
                typeof updater === "function"
                    ? (updater as (previous: T | null) => T)(dataRef.current)
                    : updater;

            dataRef.current = next;
            writeCache(policy.key, next, { version: policy.version });
            setDataState(next);
        },
        [policy.key, policy.version]
    );

    return {
        data,
        loading,
        refreshing,
        error,
        usingCachedData,
        lastUpdatedAt,
        refresh: fetchNow,
        setData,
    };
}
