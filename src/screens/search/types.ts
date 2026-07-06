export interface Event {
    id: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    image: string;
    isBookmarked?: boolean;
}