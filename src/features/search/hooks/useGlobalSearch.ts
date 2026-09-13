import { useMemo, useState } from "react";
import {
    CalendarDays,
    Megaphone,
    PackageSearch,
    ShoppingBag,
    Store,
    Users,
    type LucideIcon,
} from "lucide-react-native";
import { CACHE_POLICIES, readCache } from "@/core/cache";
import type { AnnouncementEntry } from "@/features/announcements/services/announcementsService";
import type { BuySellEntry } from "@/features/buysell/services/buySellService";
import type { Event } from "@/features/events/services/searchTypes";
import type { LostFoundEntry } from "@/features/lostfound/services/lostFoundTypes";
import type { Outlet } from "@/features/outlets/services/outletTypes";
import type { Representative } from "@/features/about/services/representativesService";
import { SEARCH_DESTINATIONS, type SearchTarget } from "../destinations";

export interface SearchResultItem {
    id: string;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    target: SearchTarget;
}

export interface SearchSection {
    key: string;
    title: string;
    data: SearchResultItem[];
    /** Results matched but not shown, so the UI can say so instead of silently cutting. */
    hiddenCount: number;
}

/** Content results per section. Screens are never capped — the list is short already. */
const MAX_PER_CONTENT_SECTION = 4;

const normalise = (value: string) => value.toLowerCase().trim();

/**
 * 0 means no match. Higher is better: a title prefix beats a title substring, which
 * beats a hit anywhere else. Every term in the query must land somewhere, so typing
 * more words narrows rather than widens.
 */
const scoreMatch = (query: string, title: string, haystack: string[]): number => {
    const terms = query.split(/\s+/).filter(Boolean);
    if (terms.length === 0) return 0;

    const lowerTitle = normalise(title);
    const fields = [lowerTitle, ...haystack.map(normalise)];

    let total = 0;
    for (const term of terms) {
        if (lowerTitle.startsWith(term)) total += 100;
        else if (lowerTitle.includes(term)) total += 50;
        else if (fields.some((field) => field.includes(term))) total += 10;
        else return 0;
    }

    return total;
};

interface CachedContent {
    announcements: AnnouncementEntry[];
    events: Event[];
    outlets: Outlet[];
    buySell: BuySellEntry[];
    lostFound: LostFoundEntry[];
    representatives: Representative[];
}

/**
 * Reads every cached list straight off disk, synchronously.
 *
 * Search issues no requests of its own: everything it looks through was already
 * fetched and cached by the screen that owns it, so results appear instantly and work
 * with no signal. The cost is that a section someone has never opened is empty here
 * until they do.
 */
const readCachedContent = (): CachedContent => ({
    announcements:
        readCache<AnnouncementEntry[]>(CACHE_POLICIES.announcements.key, {
            version: CACHE_POLICIES.announcements.version,
        })?.data ?? [],
    events:
        readCache<Event[]>(CACHE_POLICIES.events.key, {
            version: CACHE_POLICIES.events.version,
        })?.data ?? [],
    outlets:
        readCache<Outlet[]>(CACHE_POLICIES.outlets.key, {
            version: CACHE_POLICIES.outlets.version,
        })?.data ?? [],
    buySell:
        readCache<BuySellEntry[]>(CACHE_POLICIES.buySell.key, {
            version: CACHE_POLICIES.buySell.version,
        })?.data ?? [],
    lostFound:
        readCache<LostFoundEntry[]>(CACHE_POLICIES.lostFound.key, {
            version: CACHE_POLICIES.lostFound.version,
        })?.data ?? [],
    representatives:
        readCache<Representative[]>(CACHE_POLICIES.representatives.key, {
            version: CACHE_POLICIES.representatives.version,
        })?.data ?? [],
});

const rank = <T,>(
    items: T[],
    query: string,
    toTitle: (item: T) => string,
    toHaystack: (item: T) => string[]
): T[] =>
    items
        .map((item) => ({ item, score: scoreMatch(query, toTitle(item), toHaystack(item)) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item);

const capped = (
    key: string,
    title: string,
    items: SearchResultItem[]
): SearchSection | null => {
    if (items.length === 0) return null;

    return {
        key,
        title,
        data: items.slice(0, MAX_PER_CONTENT_SECTION),
        hiddenCount: Math.max(0, items.length - MAX_PER_CONTENT_SECTION),
    };
};

export const useGlobalSearch = (query: string, isSignedIn: boolean): SearchSection[] => {
    // Read once per visit to the search screen. Re-reading on every keystroke would
    // parse the whole cache again for no benefit; the data can't change while the
    // user is typing here.
    const [content] = useState(readCachedContent);

    return useMemo(() => {
        const q = normalise(query);
        if (!q) return [];

        const screens = rank(
            SEARCH_DESTINATIONS.filter((d) => !d.requiresAuth || isSignedIn),
            q,
            (d) => d.title,
            (d) => [d.subtitle, ...d.keywords]
        ).map<SearchResultItem>((d) => ({
            id: d.id,
            title: d.title,
            subtitle: d.subtitle,
            icon: d.icon,
            target: d.target,
        }));

        const sections: (SearchSection | null)[] = [
            screens.length > 0
                ? { key: "screens", title: "Screens", data: screens, hiddenCount: 0 }
                : null,

            capped(
                "announcements",
                "Announcements",
                rank(content.announcements, q, (a) => a.title, (a) => [a.description]).map((a) => ({
                    id: `announcement-${a.id}`,
                    title: a.title,
                    subtitle: a.description || "Announcement",
                    icon: Megaphone,
                    target: { kind: "screen", screen: "Announcements" },
                }))
            ),

            capped(
                "events",
                "Events",
                rank(content.events, q, (e) => e.title, (e) => [e.venue, e.description]).map((e) => ({
                    id: `event-${e.id}`,
                    title: e.title,
                    subtitle: [e.date, e.venue].filter(Boolean).join(" · ") || "Event",
                    icon: CalendarDays,
                    target: { kind: "tab", tab: "Events" },
                }))
            ),

            capped(
                "outlets",
                "Outlets",
                rank(
                    content.outlets,
                    q,
                    (o) => o.name,
                    (o) => [o.description ?? "", o.landmark ?? "", ...o.menu.map((m) => m.name)]
                ).map((o) => ({
                    id: `outlet-${o.id}`,
                    title: o.name,
                    subtitle: o.landmark || o.description || "Outlet",
                    icon: Store,
                    target: { kind: "screen", screen: "Outlets" },
                }))
            ),

            capped(
                "buy-sell",
                "Marketplace",
                rank(content.buySell, q, (b) => b.item_name, (b) => [b.description]).map((b) => ({
                    id: `buysell-${b.id}`,
                    title: b.item_name,
                    subtitle:
                        b.asking_price_in_rs !== null
                            ? `₹${b.asking_price_in_rs} · ${b.status === "sold" ? "Sold" : "Selling"}`
                            : b.status === "sold"
                              ? "Sold"
                              : "Selling",
                    icon: ShoppingBag,
                    target: { kind: "screen", screen: "BuySell" },
                }))
            ),

            capped(
                "representatives",
                "Representatives",
                rank(
                    content.representatives,
                    q,
                    (r) => r.name,
                    (r) => [r.position, r.email]
                ).map((r) => ({
                    id: `representative-${r.id}`,
                    title: r.name,
                    subtitle: r.position,
                    icon: Users,
                    target: { kind: "screen", screen: "Representatives" },
                }))
            ),

            capped(
                "lost-found",
                "Lost & Found",
                rank(content.lostFound, q, (l) => l.item_name, (l) => [l.description]).map((l) => ({
                    id: `lostfound-${l.id}`,
                    title: l.item_name,
                    subtitle: l.status === "found" ? "Found" : "Lost",
                    icon: PackageSearch,
                    target: { kind: "screen", screen: "LostFound" },
                }))
            ),
        ];

        return sections.filter((section): section is SearchSection => section !== null);
    }, [content, isSignedIn, query]);
};
