import {
    Bus,
    CalendarDays,
    Car,
    Ellipsis,
    GraduationCap,
    House,
    Info,
    Map,
    Megaphone,
    PackageSearch,
    Search,
    Settings2,
    ShieldCheck,
    ShoppingBag,
    Store,
    UserRound,
    Users,
    UtensilsCrossed,
    Wrench,
    type LucideIcon,
} from "lucide-react-native";
import type { TabName } from "@/core/navigation/tabs";
import type { RootStackParamList } from "@/core/navigation/types";

/** Where a result sends you: one of the five pager tabs, or a pushed stack screen. */
export type SearchTarget =
    | { kind: "tab"; tab: TabName }
    | { kind: "screen"; screen: keyof RootStackParamList };

export interface SearchDestination {
    id: string;
    title: string;
    /** The breadcrumb under the title — where this lives in the app. */
    subtitle: string;
    icon: LucideIcon;
    /**
     * Extra terms that should match. Covers what people actually type rather than
     * only the official label: "food" for Outlets, "timetable" for Course Search.
     */
    keywords: string[];
    target: SearchTarget;
    /** Hidden from results unless the user is signed in. */
    requiresAuth?: boolean;
}

/**
 * Every place in the app worth jumping to, in one list.
 *
 * Deliberately hand-written rather than derived from the navigator: the useful search
 * terms ("food", "wallet", "timetable") aren't route names, and a route list would
 * also surface screens that make no sense to land on cold, like the admin sub-pages.
 */
export const SEARCH_DESTINATIONS: SearchDestination[] = [
    {
        id: "tab-home",
        title: "Home",
        subtitle: "Tab · Mess, timetable, quick actions",
        icon: House,
        keywords: ["dashboard", "greeting", "qr", "mess card"],
        target: { kind: "tab", tab: "Home" },
    },
    {
        id: "tab-events",
        title: "Events",
        subtitle: "Tab · Campus events feed",
        icon: CalendarDays,
        keywords: ["event", "fest", "workshop", "talk", "happening"],
        target: { kind: "tab", tab: "Events" },
    },
    {
        id: "tab-tools",
        title: "Tools",
        subtitle: "Tab · Campus utilities",
        icon: Wrench,
        keywords: ["utility", "utilities"],
        target: { kind: "tab", tab: "Tools" },
    },
    {
        id: "tab-bus",
        title: "Bus Schedule",
        subtitle: "Tab · Departures and routes",
        icon: Bus,
        keywords: ["shuttle", "timing", "departure", "route", "stop", "transport"],
        target: { kind: "tab", tab: "Bus" },
    },
    {
        id: "tab-more",
        title: "More",
        subtitle: "Tab · Everything else",
        icon: Ellipsis,
        keywords: ["menu", "other"],
        target: { kind: "tab", tab: "More" },
    },
    {
        id: "screen-outlets",
        title: "Outlets",
        subtitle: "More · Shops, cafés and menus",
        icon: Store,
        keywords: ["food", "canteen", "cafe", "coffee", "snack", "shop", "menu", "price"],
        target: { kind: "screen", screen: "Outlets" },
    },
    {
        id: "screen-announcements",
        title: "Announcements",
        subtitle: "Home · Notices from campus",
        icon: Megaphone,
        keywords: ["notice", "news", "update", "circular"],
        target: { kind: "screen", screen: "Announcements" },
    },
    {
        id: "screen-campus-map",
        title: "Campus Map",
        subtitle: "More · Find your way around",
        icon: Map,
        keywords: ["location", "building", "directions", "where", "navigate"],
        target: { kind: "screen", screen: "CampusMap" },
    },
    {
        id: "screen-lost-found",
        title: "Lost & Found",
        subtitle: "Tools · Report and claim items",
        icon: PackageSearch,
        keywords: ["lost", "found", "missing", "wallet", "id card", "keys"],
        target: { kind: "screen", screen: "LostFound" },
    },
    {
        id: "screen-buy-sell",
        title: "Buy & Sell",
        subtitle: "Tools · Campus marketplace",
        icon: ShoppingBag,
        keywords: ["marketplace", "sell", "buy", "listing", "bid", "second hand"],
        target: { kind: "screen", screen: "BuySell" },
    },
    {
        id: "screen-cabshare",
        title: "Cabshare",
        subtitle: "Tools · Share a ride",
        icon: Car,
        keywords: ["cab", "taxi", "ride", "airport", "share", "travel"],
        target: { kind: "screen", screen: "Cabshare" },
    },
    {
        id: "screen-course-search",
        title: "Course Search",
        subtitle: "Home · Build your timetable",
        icon: GraduationCap,
        keywords: ["course", "timetable", "schedule", "class", "subject", "credit"],
        target: { kind: "screen", screen: "CourseSearch" },
    },
    {
        id: "screen-mess-feedback",
        title: "Mess Feedback",
        subtitle: "Tools · Rate today's meal",
        icon: UtensilsCrossed,
        keywords: ["mess", "food", "feedback", "rating", "meal", "dinner", "lunch"],
        target: { kind: "screen", screen: "MessFeedback" },
    },
    {
        id: "screen-representatives",
        title: "Representatives",
        subtitle: "More · Student body contacts",
        icon: Users,
        keywords: ["contact", "senate", "council", "secretary", "rep"],
        target: { kind: "screen", screen: "Representatives" },
    },
    {
        id: "screen-profile",
        title: "Profile",
        subtitle: "Home · Your account",
        icon: UserRound,
        keywords: ["account", "me", "photo", "email"],
        target: { kind: "screen", screen: "Profile" },
        requiresAuth: true,
    },
    {
        id: "screen-settings",
        title: "Settings",
        subtitle: "More · Theme and account",
        icon: Settings2,
        keywords: ["theme", "dark mode", "light", "appearance", "sign out", "logout"],
        target: { kind: "screen", screen: "Settings" },
    },
    {
        id: "screen-about",
        title: "About INSIIT",
        subtitle: "More · What this app is",
        icon: Info,
        keywords: ["about", "version", "app"],
        target: { kind: "screen", screen: "AboutInsiit" },
    },
    {
        id: "screen-team",
        title: "Team INSIIT",
        subtitle: "More · Who built this",
        icon: Users,
        keywords: ["team", "credits", "developers", "contributors"],
        target: { kind: "screen", screen: "TeamINSIIT" },
    },
    {
        id: "screen-privacy",
        title: "Privacy Policy",
        subtitle: "More · How your data is handled",
        icon: ShieldCheck,
        keywords: ["privacy", "data", "policy", "terms"],
        target: { kind: "screen", screen: "PrivacyPolicy" },
    },
];

/** Icon for content results that have no destination icon of their own. */
export const CONTENT_FALLBACK_ICON = Search;
