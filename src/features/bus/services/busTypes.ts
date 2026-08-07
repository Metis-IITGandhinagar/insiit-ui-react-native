export type BusType = "EECO" | "29" | "56";

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
}
