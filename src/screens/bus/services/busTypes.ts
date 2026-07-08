export type BusType = "EECO" | "29" | "56";

export interface ApiBusResponse {
    _id: string;
    BusName: string;      // Matches "EECO", "29", or "56"
    DepartureTime: string; // e.g., "7:50 AM", "5:00 PM"
    Source: string;        // e.g., "Mess"
    Destination: string;   // e.g., "JEET"
    Stops: string[];
    __v?: number;        
}

export interface BusDeparture {
    time: string;
    from: string;
    to: string;
    isNext: boolean;
}