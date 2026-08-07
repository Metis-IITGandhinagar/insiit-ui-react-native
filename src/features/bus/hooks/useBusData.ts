import { useState, useEffect, useMemo, useCallback } from "react";
import { BusRoute, ApiBusResponse, BusDeparture } from "../services/busTypes";
import { busService, calculateMinutesLeft, formatCountdown, formatDepartureTime } from "../services/busServices";

export const useBusData = () => {
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
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

    /**
     * The routes to offer as tabs, derived from the data rather than hardcoded: the
     * backend has no route/type column, so `name` is the only route identifier, and a
     * fixed list would silently show nothing whenever the names didn't match.
     */
    const routes = useMemo(() => {
        const names = rawBuses
            .map(bus => bus.name?.trim())
            .filter((name): name is string => !!name);

        return [...new Set(names)].sort((a, b) => a.localeCompare(b));
    }, [rawBuses]);

    // Keep the selection valid as routes load or change; falling back to the first
    // route means the screen is never stuck on a tab that no longer exists.
    useEffect(() => {
        if (routes.length === 0) {
            if (selectedRoute !== null) setSelectedRoute(null);
        } else if (selectedRoute === null || !routes.includes(selectedRoute)) {
            setSelectedRoute(routes[0]);
        }
    }, [routes, selectedRoute]);

    const filteredBuses = useMemo(() => {
        if (!selectedRoute) return [];

        return rawBuses.filter(bus => bus.name?.trim() === selectedRoute);
    }, [rawBuses, selectedRoute]);

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
            isNext: nextBusItem ? bus.time === nextBusItem.time && bus.from === nextBusItem.from : false,
            countdown: formatCountdown(bus.minutesLeft),
            passed: bus.minutesLeft < 0
        }));

        let stops: string[] = [];
        if (nextBusItem) {
            stops = [nextBusItem.from, ...nextBusItem.rawStops, nextBusItem.to];
        }

        return {
            departures,
            nextBus: nextBusItem ? {
                vehicle: nextBusItem.vehicle || selectedRoute || 'Bus',
                departure: nextBusItem.time,
                countdown: formatCountdown(nextBusItem.minutesLeft),
                from: nextBusItem.from,
                to: nextBusItem.to
            } : null,
            stops
        };
    }, [filteredBuses, selectedRoute]);

    return {
        routes,
        selectedRoute,
        setSelectedRoute,
        loading,
        error,
        refreshBuses, 
        ...scheduleData
    };
};