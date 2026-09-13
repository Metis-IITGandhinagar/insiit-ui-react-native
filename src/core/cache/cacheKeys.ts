/**
 * Every disk-cache key and its freshness policy, in one place so keys can't collide
 * and TTLs can be compared against each other at a glance.
 *
 * `ttlMs` does not expire anything — nothing is ever evicted for being old. It only
 * decides when a screen may show an "updated X ago" hint, and how eagerly the hook
 * revalidates. Stale data still beats a spinner, and it always beats an error page.
 *
 * `version` must be bumped whenever the cached shape changes, or an old payload will
 * be handed to new rendering code.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export interface CachePolicy {
    key: string;
    version: number;
    ttlMs: number;
}

/** Prefix for anything scoped to the signed-in user; cleared on sign-out. */
export const USER_SCOPED_PREFIX = "user:";

export const CACHE_POLICIES = {
    /** Timetables change once a semester at most. */
    buses: { key: "buses", version: 1, ttlMs: 24 * HOUR },
    /** Opening hours and menus; edited rarely. */
    outlets: { key: "outlets", version: 1, ttlMs: 12 * HOUR },
    /** Time-sensitive, but a slightly old notice still beats a blank screen. */
    announcements: { key: "announcements", version: 1, ttlMs: 15 * MINUTE },
    events: { key: "events", version: 1, ttlMs: 30 * MINUTE },
    buySell: { key: "buy-sell", version: 1, ttlMs: 10 * MINUTE },
    /** The student council changes once an academic year. */
    representatives: { key: "representatives", version: 1, ttlMs: 24 * HOUR },
    lostFound: { key: "lost-found", version: 1, ttlMs: 10 * MINUTE },
} as const satisfies Record<string, CachePolicy>;

/**
 * Admin permissions, keyed by email so one account's rights can't leak into another's
 * session on a shared device.
 */
export const adminPermissionsPolicy = (email: string): CachePolicy => ({
    key: `${USER_SCOPED_PREFIX}permissions:${email.toLowerCase()}`,
    version: 1,
    ttlMs: 24 * HOUR,
});
