import React from "react";
import {ScreenContainer,LoadingView,} from "../../components/layout";
import { useNavigation } from "@react-navigation/native";
import { MainTabNavigationProp, RootNavigationProp } from "../../navigation/types";
import {
    GreetingCard,
    MessPreviewCard,
    BusPreviewCard,
    AnnouncementList,
    UpcomingEventsCard,
    QuickActionsGrid,
} from "./components";
import { useHome } from "./hooks/useHome";
import { useMess } from "../mess/hooks/useMess";
import { getNextMeal } from "../mess/mealStatus";
import { getCurrentDayIndex } from "../mess/utils/day";

export function HomeScreen() {
    const navigation = useNavigation<RootNavigationProp>();
    const home = useHome();
    const mess = useMess();
    

    if (
        home.isLoading ||
        mess.isLoading ||
        !home.data ||
        !mess.data
    ) {
        return <LoadingView />;
    }

    const nextMeal = getNextMeal(
        mess.data.week,
        getCurrentDayIndex()
    );

    return (
        <ScreenContainer>
            <GreetingCard
                name={home.data.user.name}
            />

            <MessPreviewCard
                meal={nextMeal}
                onPress={() => navigation.navigate("Mess")}
            />

            <BusPreviewCard
                route={home.data.nextBus?.route}
                departure={home.data.nextBus?.departure}
                arrival={home.data.nextBus?.arrival}
                minutes={home.data.nextBus?.minutes}
            />

            <AnnouncementList
                announcements={home.data.announcements}
            />

            <UpcomingEventsCard
                events={home.data.events}
            />

            <QuickActionsGrid
                actions={home.data.quickActions}
            />
        </ScreenContainer>
    );
}