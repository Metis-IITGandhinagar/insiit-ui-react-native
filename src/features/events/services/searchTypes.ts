export interface Event {
    id: string;
    title: string;
    venue: string;
    /** Localised display string. Use startDateTime for anything computational. */
    date: string;
    /** Localised display string. Use startDateTime for anything computational. */
    time: string;
    /** Localised display time for the event end, when available. */
    endTime?: string;
    /** Raw ISO instant from the backend, kept so edits round-trip exactly. */
    startDateTime?: string;
    /** Optional event end instant, when supported by the API. */
    endDateTime?: string;
    /** Author. The backend scopes edits and deletes to this, so the UI gates on it too. */
    addedByEmail?: string;
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
