import { useEffect, useState, useCallback } from "react";
import { messService } from "./messService";
import { MessMenuResponse, ActiveMealState, MealType } from "./messTypes";

export const useMessData = () => {
    const [menuData, setMenuData] = useState<MessMenuResponse | null>(null);
    const [currentMeal, setCurrentMeal] = useState<ActiveMealState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const computeActiveMealState = useCallback((data: MessMenuResponse) => {
        if (!data || !data.mess || data.mess.length === 0) return;

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const totalMinutes = hour * 60 + minute;

        const jsDay = now.getDay();
        const backendDayLookup = jsDay === 0 ? 7 : jsDay;

        const dailyMenu = data.mess.find(m => m.day === backendDayLookup) || data.mess[0];

        let selectedKey: MealType = "breakfast";
        let displayTitle = "Breakfast";
        let operationalWindow = "07:45 AM - 10:00 AM";
        let closingMinutes = 10 * 60;

        if (totalMinutes < 10 * 60) {
            selectedKey = "breakfast";
            displayTitle = "Breakfast";
            operationalWindow = "07:45 AM - 10:00 AM";
            closingMinutes = 10 * 60;
        } else if (totalMinutes < 14 * 60 + 15) {
            selectedKey = "lunch";
            displayTitle = "Lunch";
            operationalWindow = "12:15 PM - 02:15 PM";
            closingMinutes = 14 * 60 + 15;
        } else if (totalMinutes < 17 * 60 + 45) {
            selectedKey = "snacks";
            displayTitle = "Snacks";
            operationalWindow = "04:30 PM - 05:45 PM";
            closingMinutes = 17 * 60 + 45;
        } else if (totalMinutes < 21 * 60 + 30) {
            selectedKey = "dinner";
            displayTitle = "Dinner";
            operationalWindow = "07:30 PM - 09:30 PM";
            closingMinutes = 21 * 60 + 30;
        } else {
            const nextDayIndex = jsDay === 6 ? 7 : (jsDay + 1 === 0 ? 7 : jsDay + 1);
            const tomorrowMenu = data.mess.find(m => m.day === nextDayIndex) || data.mess[0];
            const cleanItems = tomorrowMenu.breakfast.split("\n")
                .map(item => item.trim())
                .filter(item => item !== "" && item !== "–");

            setCurrentMeal({
                mealName: "Breakfast (Tomorrow)",
                timeWindow: "07:45 AM",
                countdown: "Closed for Day",
                itemsList: cleanItems,
            });
            return;
        }

        const delta = closingMinutes - totalMinutes;
        const hrs = Math.floor(delta / 60);
        const mins = delta % 60;
        const countdownString = delta <= 0 ? "Serving Now" : hrs > 0 ? `${hrs}h ${mins}m to close`: `${mins}m to close`;

        const rawString = dailyMenu[selectedKey] || "";
        const processedItems = rawString.split("\n")
            .map(item => item.trim())
            .filter(item => item !== "" && item !== "–");

        setCurrentMeal({
            mealName: displayTitle,
            timeWindow: operationalWindow,
            countdown: countdownString,
            itemsList: processedItems,
        });
    }, []);

    const orchestrateDataSync = useCallback(async () => {
        try {
            setError(false);
            const initialCachedData = await messService.getCachedMenu();
            if (initialCachedData) {
                setMenuData(initialCachedData);
                computeActiveMealState(initialCachedData);
                setLoading(false);
            }

            const freshData = await messService.fetchAndSyncMenu(initialCachedData?.id);
            setMenuData(freshData);
            computeActiveMealState(freshData);
        } catch (err) {
            if (!menuData) setError(true);
        } finally {
            setLoading(false);
        }
    }, [menuData, computeActiveMealState]);

    useEffect(() => {
        orchestrateDataSync();
    }, []);

    return { menuData, currentMeal, loading, error, manualRefresh: orchestrateDataSync };
};