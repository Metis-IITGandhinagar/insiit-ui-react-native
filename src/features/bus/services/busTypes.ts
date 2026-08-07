/**
 * A route is identified by the bus `name` the backend returns ("GTS-07", ...).
 * There is no separate route/type column, so the set of routes is whatever names
 * exist in the data — not a fixed union we can hardcode.
 */
export type BusRoute = string;

/** Mirrors `BusEntry` in the backend (src/schemas/bus_schemas.rs). */
export interface ApiBusResponse {
    id: number;
    name: string;
    /**
     * `HH:MM:SS` from a Postgres TIME column — a schedule recurs daily, so no date.
     * Parse with parseDepartureMinutes, display with formatDepartureTime.
     */
    departure_time: string;
    source: string;
    destination: string;
    /** Intermediate stops in order, without times. */
    stops: string[];
}

/** Payload for POST /buses; the id is assigned by the database. */
export type CreateBusPayload = Omit<ApiBusResponse, 'id'>;

export interface BusDeparture {
    time: string;
    from: string;
    to: string;
    isNext: boolean;
    /** Short countdown ("12m", "2h 5m", "Now", "Passed") — see formatCountdown. */
    countdown: string;
    /** Already departed today. The list keeps these, but shows them as spent. */
    passed: boolean;
}
