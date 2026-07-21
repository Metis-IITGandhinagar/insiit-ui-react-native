export interface Event {
    id: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    image: string;
    description: string;
    isBookmarked?: boolean;
}

export interface ApiEventResponse {
    id: number;
    event_name: string;
    location: string;
    date: string;
    start_time: string;
    poster_image_url: string;
    description: string;
}