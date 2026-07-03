import { LucideIcon } from "lucide-react-native";

export interface UserSummary {
    id: string;
    name: string;
}

export interface Meal {
    title: string;
    items: string[];
}

export interface BusPreview {
    route: string;
    departure: string;
    arrival: string;
    minutes: number;
}

export interface Announcement {
    id: string;
    title: string;
    date: string;
}

export interface HomeEvent {
    id: string;
    title: string;
    venue: string;
    time: string;
}

export type QuickActionId =
    | "mess"
    | "bus"
    | "outlets"
    | "services"
    | "events"
    | "qr"
    | "timetable"
    | "more";

export interface QuickAction {
    id: QuickActionId;
    title: string;
    icon: LucideIcon;
}

export interface HomeData {
    user: UserSummary;

    mess: {
        breakfast?: Meal;
        lunch?: Meal;
        dinner?: Meal;
    };

    nextBus?: BusPreview;

    announcements: Announcement[];

    events: HomeEvent[];

    quickActions: QuickAction[];
}