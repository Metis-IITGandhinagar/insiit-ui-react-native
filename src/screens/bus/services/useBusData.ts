import { useState, useEffect, useMemo } from "react";
import { BusType, ApiBusResponse, BusDeparture } from "./busTypes";
import { busService, calculateMinutesLeft } from "./busServices";

export const useBusData = () => {
    const [selectedTab, setSelectedTab] = useState<BusType>("56");
    const [rawBuses, setRawBuses] = useState<ApiBusResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        busService.getAllBuses()
            .then(data => {
                setRawBuses(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || "Failed to load schedules");
                setLoading(false);
            });
    }, []);

    const filteredBuses = useMemo(() => {
        return rawBuses.filter(bus =>
            bus.BusName.toLowerCase().includes(selectedTab.toLowerCase())
        );
    }, [rawBuses, selectedTab]);

    const scheduleData = useMemo(() => {
        if (filteredBuses.length === 0) {
            return { departures: [], nextBus: null, stops: [] };
        }

        const mapped = filteredBuses.map(bus => ({
            vehicle: bus.BusName,
            time: bus.DepartureTime,
            from: bus.Source,
            to: bus.Destination,
            minutesLeft: calculateMinutesLeft(bus.DepartureTime),
            rawStops: bus.Stops // Already an array from Mongo
        }));

        // Separate active upcoming schedules from historical ones that passed earlier today
        const upcoming = mapped.filter(b => b.minutesLeft >= 0).sort((a, b) => a.minutesLeft - b.minutesLeft);
        const passed = mapped.filter(b => b.minutesLeft < 0).sort((a, b) => a.minutesLeft - b.minutesLeft);

        // Combine arrays to push past buses to the bottom of the list view
        const sortedSchedules = [...upcoming, ...passed];
        const nextBusItem = upcoming[0] || sortedSchedules[0];

        const departures: BusDeparture[] = sortedSchedules.map(bus => ({
            time: bus.time,
            from: bus.from,
            to: bus.to,
            isNext: nextBusItem ? bus.time === nextBusItem.time && bus.from === nextBusItem.from : false
        }));

        // Premium feature: Synthesize a complete terminal-to-terminal stop list string array
        let stops: string[] = [];
        if (nextBusItem) {
            stops = [nextBusItem.from, ...nextBusItem.rawStops, nextBusItem.to];
        }

        return {
            departures,
            nextBus: nextBusItem ? {
                vehicle: nextBusItem.vehicle || `${selectedTab}-Seater`,
                departure: nextBusItem.time,
                countdown: nextBusItem.minutesLeft < 0
                    ? "Passed"
                    : nextBusItem.minutesLeft === 0 ? "Now" : `${nextBusItem.minutesLeft} min`,
                from: nextBusItem.from,
                to: nextBusItem.to
            } : null,
            stops
        };
    }, [filteredBuses, selectedTab]);

    return {
        selectedTab,
        setSelectedTab,
        loading,
        error,
        ...scheduleData
    };
};