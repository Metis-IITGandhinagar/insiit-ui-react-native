import { Meal, MealStatus } from "./types";

function toMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
}

function currentMinutes(): number {
    const now = new Date();

    return now.getHours() * 60 + now.getMinutes();
}

/**
 * Returns the current status of a meal.
 *
 * Upcoming  -> current time is before the meal starts.
 * Ongoing   -> current time is between start and end.
 * Completed -> current time is after the meal ends.
 */
export function getMealStatus(
    meal: Meal,
    now: number = currentMinutes()
): MealStatus {
    const start = toMinutes(meal.startTime);
    const end = toMinutes(meal.endTime);

    if (now < start) {
        return "upcoming";
    }

    if (now <= end) {
        return "ongoing";
    }

    return "completed";
}

/**
 * Returns the next relevant meal.
 *
 * Priority:
 * 1. Current ongoing meal
 * 2. Next upcoming meal
 * 3. First meal of tomorrow
 */
export function getNextMeal(
    week: { meals: Meal[] }[],
    selectedDay: number
): Meal | undefined {
    const now = currentMinutes();

    const today = week[selectedDay];

    if (!today) {
        return undefined;
    }

    for (const meal of today.meals) {
        const status = getMealStatus(meal, now);

        if (status === "ongoing") {
            return meal;
        }

        if (status === "upcoming") {
            return meal;
        }
    }

    const tomorrow = week[(selectedDay + 1) % week.length];

    return tomorrow?.meals[0];
}