import React from "react";

import {
    ScreenContainer,
    LoadingView,
} from "../../components/layout";

import {
    GreetingCard,
    MessPreviewCard,
    BusPreviewCard,
    AnnouncementList,
    UpcomingEventsCard,
    QuickActionsGrid,
} from "./components";

import { useHome } from "./hooks/useHome";

export function HomeScreen() {
    const { data, isLoading } = useHome();

    if (isLoading || !data) {
        return <LoadingView />;
    }

    return (
        <ScreenContainer>
            <GreetingCard
                name={data?.user?.name}
            />

            <MessPreviewCard
                breakfast={data?.mess?.breakfast}
                lunch={data?.mess?.lunch}
                dinner={data?.mess?.dinner}
            />

            <BusPreviewCard
                route={data?.nextBus?.route}
                departure={data?.nextBus?.departure}
                arrival={data?.nextBus?.arrival}
                minutes={data?.nextBus?.minutes}
            />

            <AnnouncementList
                announcements={data?.announcements}
            />

            <UpcomingEventsCard
                events={data?.events}
            />

            <QuickActionsGrid actions={data.quickActions} />
        </ScreenContainer>
    );
}