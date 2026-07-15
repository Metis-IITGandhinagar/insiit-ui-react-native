export type BusType = "EECO" | "29" | "56";

export interface ApiBusResponse {
    _id: string;
    BusName: string;      
    DepartureTime: string; 
    Source: string;       
    Destination: string;   
    Stops: string[];
    __v?: number;        
}

export interface BusDeparture {
    time: string;
    from: string;
    to: string;
    isNext: boolean;
}