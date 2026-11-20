// Shapes returned by the backend's /cabshare endpoints (src/cabshare in
// insiit-backend-rust). Times are RFC 3339 strings, like every INSIIT endpoint.

export type Direction = 'from_campus' | 'to_campus';
export type Vehicle = 'cab' | 'auto';

export interface Place {
    id: string;
    name: string;
    parent: string | null;
    lat: number;
    lng: number;
    km: number;
    /** Stops from campus to here, campus first. */
    path: string[];
}

export interface VehicleInfo {
    id: Vehicle;
    seats: number;
    suitcases: number;
    handbags: number;
    base: number;
    included_km: number;
    per_km: number;
}

export interface Catalogue {
    campus: string;
    places: Place[];
    vehicles: VehicleInfo[];
    limits: {
        max_slots: number;
        max_days_ahead: number;
        reveal_minutes: number;
        free_cancel_hours: number;
        message_max: number;
        note_max: number;
    };
}

export interface Stop {
    place: string;
    name: string;
    you: boolean;
    people: number;
}

export interface FareLeg {
    from: string;
    from_name: string;
    to: string;
    to_name: string;
    km: number;
    cost: number;
    people: number;
    you: boolean;
    your_part: number;
}

export type PriceSource = 'rate' | 'riders' | 'quote' | 'quote_final';

export interface TripFare {
    km: number;
    total: number;
    riders: number;
    your_share: number;
    alone: number;
    you_save: number;
    stop: string;
    legs: FareLeg[];
    vehicle: Vehicle;
    base: number;
    included_km: number;
    per_km: number;
    price_source: PriceSource;
    quotes: number;
    factor: number;
    final_stop: string;
    your_quote: number | null;
}

/** One joinable ride in the feed. Counts only: never who is going. */
export interface Ride {
    destination: string;
    destination_name: string;
    direction: Direction;
    vehicle: Vehicle;
    departure: string;
    /** Every time this ride can leave (a lone rider may offer several). */
    times: string[];
    going: number;
    seats: number;
    seats_free: number;
    suitcases_free: number;
    handbags_free: number;
    final: string;
    final_name: string;
    stops: Stop[];
    /** Places on its road nobody has picked yet: you can get off (or on) there too. */
    passes: { place: string; name: string }[];
    fare: TripFare;
}

export interface FeedPage {
    rides: Ride[];
    next: string | null;
}

export interface Rider {
    you: boolean;
    label: string;
    handbags: number;
    suitcases: number;
    party: number;
    checked_in: boolean;
    place_note: string | null;
    stop: string;
    stop_name: string;
    /** Relay handle, from 15 minutes before (and after the ride). */
    contact?: string;
    /** From 15 minutes before. */
    name?: string;
    gender?: string;
    reported?: boolean;
}

export interface TripCard {
    kind: 'trip';
    trip: number;
    request: number;
    fare: TripFare;
    stops: Stop[];
    final: string;
    final_name: string;
    checkin: {
        done: boolean;
        opens: string;
        closes: string;
        open: boolean;
        point: [number, number];
        radius_m: number;
    };
    destination: string;
    destination_name: string;
    direction: Direction;
    departure: string;
    riders: Rider[];
    vehicle: Vehicle;
    people: number;
    seats_left: number;
    handbags: number;
    suitcases: number;
    fixed: boolean;
    revealed: boolean;
    departed: boolean;
    rode: boolean;
    settled: boolean;
    notice: string | null;
    can_cancel: boolean;
    late_cancel: boolean;
    quote: number | null;
    place_note: string | null;
}

export interface RequestCard {
    kind: 'request';
    request: number;
    destination: string;
    destination_name: string;
    direction: Direction;
    slots: string[];
    over: boolean;
    handbags: number;
    suitcases: number;
    party: number;
    vehicle: Vehicle;
    place_note: string | null;
    notice: string | null;
    quote: number | null;
    fare: {
        km: number;
        total: number;
        your_share: number;
        full_cab_share: number;
        vehicle: Vehicle;
        price_source: PriceSource;
        quotes: number;
    };
}

export interface CancelledCard {
    kind: 'cancelled';
    request: number;
    destination: string;
    destination_name: string;
}

export type Card = TripCard | RequestCard | CancelledCard;

export interface MyTrips {
    trips: TripCard[];
    requests: RequestCard[];
    past: (TripCard | RequestCard)[];
    past_next: string | null;
}

export interface Message {
    id: number;
    from: string;
    mine: boolean;
    body: string;
    at: string;
}

export interface ChatPage {
    messages: Message[];
    older: string | null;
}

export interface CabNotification {
    id: number;
    kind: string;
    category: string;
    title: string;
    body: string;
    trip: number | null;
    request: number | null;
    at: string;
    read: boolean;
    times: number;
}

export interface NotificationPage {
    notifications: CabNotification[];
    unread: number;
    older: number | null;
}

export type NotifyPrefs = Record<'group' | 'messages' | 'checkins' | 'reminders' | 'score', boolean>;

export interface Profile {
    email: string;
    name: string;
    handle: string;
    gender: 'woman' | 'man' | 'non_binary' | null;
    score: number;
    start: number;
    history: { reason: string; change: number; destination: string | null; at: string }[];
}

/** What posting or joining sends. `departure` joins one time; `slots` posts several. */
export interface RideRequest {
    destination: string;
    direction: Direction;
    slots?: string[];
    departure?: string;
    handbags: number;
    suitcases: number;
    party: number;
    vehicle: Vehicle;
    quote?: number | null;
    place_note?: string | null;
}
