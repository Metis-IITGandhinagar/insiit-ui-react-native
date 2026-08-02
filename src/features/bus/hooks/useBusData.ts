import { useState, useEffect, useMemo, useCallback } from "react";
import { BusType, ApiBusResponse, BusDeparture } from "../services/busTypes";
import { busService, calculateMinutesLeft } from "../services/busServices";

export const useBusData = () => {
    const [selectedTab, setSelectedTab] = useState<BusType>("56");
    const [rawBuses, setRawBuses] = useState<ApiBusResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refreshBuses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await busService.getAllBuses();
            setRawBuses(data);
        } catch (err: any) {
            setError(err.message || "Failed to load schedules");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshBuses();
    }, [refreshBuses]);

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
            rawStops: bus.Stops
        }));

        const upcoming = mapped.filter(b => b.minutesLeft >= 0).sort((a, b) => a.minutesLeft - b.minutesLeft);
        const passed = mapped.filter(b => b.minutesLeft < 0).sort((a, b) => a.minutesLeft - b.minutesLeft);

        const sortedSchedules = [...upcoming, ...passed];
        const nextBusItem = upcoming[0] || sortedSchedules[0];

        const departures: BusDeparture[] = sortedSchedules.map(bus => ({
            time: bus.time,
            from: bus.from,
            to: bus.to,
            isNext: nextBusItem ? bus.time === nextBusItem.time && bus.from === nextBusItem.from : false
        }));

        let stops: string[] = [];
        if (nextBusItem) {
            stops = [nextBusItem.from, ...nextBusItem.rawStops, nextBusItem.to];
        }

        return {
            departures,
            nextBus: nextBusItem ? {
                vehicle: nextBusItem.vehicle || `${selectedTab}-Seater`,
                departure: nextBusItem.time,
                countdown:
                    nextBusItem.minutesLeft < 0
                        ? "Passed"
                        : nextBusItem.minutesLeft === 0
                            ? "Now"
                            : nextBusItem.minutesLeft >= 60
                                ? (() => {
                                    const hours = Math.floor(nextBusItem.minutesLeft / 60);
                                    const mins = nextBusItem.minutesLeft % 60;

                                    return mins === 0
                                        ? `${hours}h`
                                        : `${hours}h ${mins}m`;
                                })()
                                : `${nextBusItem.minutesLeft}m`,
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
        refreshBuses, 
        ...scheduleData
    };
};