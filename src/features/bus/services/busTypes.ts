export type BusRoute = string;

/** Mirrors `BusEntry` in the backend (src/schemas/bus_schemas.rs). */
export interface ApiBusResponse {
    id: number;
    name: string;
    departure_time: string;
    source: string;
    destination: string;
    stops: string[];
}

/** Payload for POST /buses; the id is assigned by the database. */
export type CreateBusPayload = Omit<ApiBusResponse, 'id'>;

export interface BusDeparture {
    time: string;
    from: string;
    to: string;
    isNext: boolean;
    countdown: string;
    passed: boolean;
}
