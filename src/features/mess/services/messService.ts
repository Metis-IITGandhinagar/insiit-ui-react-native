import { mockWeekMenu } from "../data/mockWeekMenu";
import { MessData } from "../types";

export const messService = {
    async getMessData(): Promise<MessData> {
        return mockWeekMenu;
    },
};