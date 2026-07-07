export type BusType = "EECO" | "29" | "56";

export interface BusDeparture {
    time: string;
    from: string;
    to: string;
}

export interface BusRoute {
    name: BusType;
    departures: BusDeparture[];
    stops: string[];
}