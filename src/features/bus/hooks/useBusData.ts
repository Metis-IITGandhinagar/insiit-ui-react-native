import { useState, useEffect, useMemo, useCallback } from "react";
import { BusType, ApiBusResponse, BusDeparture } from "../services/busTypes";
import { busService, calculateMinutesLeft, formatDepartureTime } from "../services/busServices";

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
        // The tab is matched against the name ("56-Seater", "EECO shuttle") — there is
        // no separate route/type column. Guard the name: it's the only field a bad row
        // could leave undefined, and it used to crash the whole tab.
        return rawBuses.filter(bus =>
            (bus.name ?? '').toLowerCase().includes(selectedTab.toLowerCase())
        );
    }, [rawBuses, selectedTab]);

    const scheduleData = useMemo(() => {
        if (filteredBuses.length === 0) {
            return { departures: [], nextBus: null, stops: [] };
        }

        const mapped = filteredBuses
            .map(bus => ({
                vehicle: bus.name,
                time: formatDepartureTime(bus.departure_time),
                from: bus.source,
                to: bus.destination,
                minutesLeft: calculateMinutesLeft(bus.departure_time),
                rawStops: bus.stops ?? []
            }))
            // Drop rows whose time didn't parse rather than showing them as "departing
            // now", which is what the old silent `return 0` fallback did.
            .filter((bus): bus is typeof bus & { minutesLeft: number } => bus.minutesLeft !== null);

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