export type MealType =
    | "Breakfast"
    | "Lunch"
    | "Snacks"
    | "Dinner";

export interface Meal {
    id: string;
    type: MealType;

    /**
     * Temporary while the backend is not connected.
     * Remove these values once the backend sends meal timings.
     */
    startTime: string;
    endTime: string;

    items: string[];
}

export interface MessDay {
    date: string;
    day: string;

    meals: Meal[];
}

export interface MessData {
    week: MessDay[];
}
export type MealStatus =
    | "upcoming"
    | "ongoing"
    | "completed";