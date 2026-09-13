import { createMMKV } from "react-native-mmkv";

/**
 * Disk cache for backend GET responses.
 *
 * MMKV rather than AsyncStorage because reads are synchronous: a hook can seed its
 * state from the cache inside `useState(initialiser)` and render real content on the
 * very first frame. AsyncStorage would force a spinner for at least one frame, which
 * is the whole problem this cache exists to solve.
 *
 * Its own instance (not the theme's) so `clearAll()` on sign-out can't wipe the
 * user's theme choice.
 */
const storage = createMMKV({ id: "insiit.cache" });

/**
 * Bumped when the envelope format itself changes. Per-entry shape changes are
 * handled by each caller's own `version`, not this.
 */
const ENVELOPE_FORMAT = 1;

interface Envelope<T> {
    /** Envelope format, not payload shape. */
    f: number;
    /** Caller-supplied payload version — a mismatch discards the entry. */
    v: number;
    /** Epoch ms the payload was written. */
    t: number;
    d: T;
}

export interface CacheHit<T> {
    data: T;
    /** Epoch ms the payload was written, for "last updated" labels. */
    savedAt: number;
    /** True once older than the caller's `ttlMs`. Still returned — just flagged. */
    stale: boolean;
}

export interface ReadOptions {
    /**
     * Discards the entry when it doesn't match what was stored. Bump it whenever the
     * cached shape changes so an old payload can't crash a new screen.
     */
    version?: number;
    /** Age past which the hit is flagged `stale`. Omit to never flag it. */
    ttlMs?: number;
}

/**
 * The cached payload, or null when absent, unparseable, or written by a different
 * version. Never throws: a cache miss must degrade to a network fetch, never to a
 * crash on boot.
 */
export function readCache<T>(key: string, options: ReadOptions = {}): CacheHit<T> | null {
    const { version = 1, ttlMs } = options;

    try {
        const raw = storage.getString(key);
        if (!raw) return null;

        const envelope = JSON.parse(raw) as Envelope<T>;
        if (envelope?.f !== ENVELOPE_FORMAT || envelope.v !== version) {
            storage.remove(key);
            return null;
        }

        const savedAt = typeof envelope.t === "number" ? envelope.t : 0;

        return {
            data: envelope.d,
            savedAt,
            stale: ttlMs === undefined ? false : Date.now() - savedAt > ttlMs,
        };
    } catch (error) {
        // A corrupt entry is worth dropping, not reporting: the fetch below it will
        // repopulate the key on the next successful response.
        console.warn(`[cache] discarding unreadable entry "${key}":`, error);
        storage.remove(key);
        return null;
    }
}

/** Writes a payload. Failures are logged and swallowed — a full disk must not break a screen that already has its data. */
export function writeCache<T>(key: string, data: T, options: { version?: number } = {}): void {
    const envelope: Envelope<T> = {
        f: ENVELOPE_FORMAT,
        v: options.version ?? 1,
        t: Date.now(),
        d: data,
    };

    try {
        storage.set(key, JSON.stringify(envelope));
    } catch (error) {
        console.warn(`[cache] failed to write "${key}":`, error);
    }
}

export function removeCache(key: string): void {
    try {
        storage.remove(key);
    } catch (error) {
        console.warn(`[cache] failed to remove "${key}":`, error);
    }
}

/**
 * Drops every entry whose key starts with `prefix`. Used on sign-out to clear
 * per-user data without touching shared reference data like bus timings.
 */
export function removeCacheByPrefix(prefix: string): void {
    try {
        for (const key of storage.getAllKeys()) {
            if (key.startsWith(prefix)) storage.remove(key);
        }
    } catch (error) {
        console.warn(`[cache] failed to clear prefix "${prefix}":`, error);
    }
}

/** Wipes the whole response cache. Theme and login state live elsewhere and survive. */
export function clearCache(): void {
    try {
        storage.clearAll();
    } catch (error) {
        console.warn("[cache] failed to clear:", error);
    }
}
