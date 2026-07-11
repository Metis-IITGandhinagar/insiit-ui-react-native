export interface DayMenu {
    day: number; 
    breakfast: string; 
    lunch: string;     
    snacks: string;    
    dinner: string;    
}

export interface MessMenuResponse {
    id: string;        
    mess_name: string; 
    mess: DayMenu[];  
}

export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

export interface ActiveMealState {
    mealName: string;   
    timeWindow: string;
    countdown: string;
    itemsList: string[]; 
}

export interface UserSession {
    studentId: string;
    qrToken: string;
}