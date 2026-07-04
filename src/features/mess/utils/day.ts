export function getCurrentDayIndex(): number {
    const day = new Date().getDay();

    // JavaScript
    // 0 = Sunday
    // 1 = Monday
    // ...
    // 6 = Saturday

    switch (day) {
        case 1:
            return 0; // Monday

        case 2:
            return 1;

        case 3:
            return 2;

        case 4:
            return 3;

        case 5:
            return 4;

        case 6:
            return 5;

        default:
            return 6; // Sunday
    }
}