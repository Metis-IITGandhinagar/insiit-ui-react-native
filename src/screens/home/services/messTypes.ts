export interface DayMenu {
    day: number; 
    breakfast: string; 
    lunch: string;     
    snacks: string;    
    dinner: string;    
}

export interface MessMenuResponse {
    id: string;        // Timestamp string identifier
    mess_name: string; // "Hostel Mess"
    mess: DayMenu[];   // Array matching your Schema field name
}

export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

export interface ActiveMealState {
    mealName: string;   // Capitalized display name
    timeWindow: string;
    countdown: string;
    itemsList: string[]; // Parsed clean array from the \n string
}

export interface UserSession {
    studentId: string;
    qrToken: string;
}