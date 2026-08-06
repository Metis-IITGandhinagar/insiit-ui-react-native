export interface OutletMenuEntry {
    name: string;
    price: number;
}

export interface OutletLocation {
    latitude: number;
    longitude: number;
}

export interface Outlet {
    id: number;
    name: string;
    description?: string;
    location: OutletLocation;
    landmark?: string;
    open_time: string;
    close_time: string;
    menu: OutletMenuEntry[];
    image_url?: string;
}