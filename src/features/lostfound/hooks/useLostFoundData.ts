import { useCallback, useEffect, useState } from "react";
import { lostFoundService } from "../services/lostFoundService";
import {
    LostFoundEntry,
    LostFoundRequest,
    LostFoundClaimRequest,
} from "../services/lostFoundTypes";
import { daysUntilArchive } from "../utils/formatDate";

export function useLostFoundData() {
    const [entries, setEntries] = useState<LostFoundEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await lostFoundService.getAllLostFound();

            // Backend does not auto-archive; hide anything past its
            // 30-day window on the client as a stopgap.
            const active = data.filter(
                (entry) => daysUntilArchive(entry.added_on_timestamp) > 0
            );

            setEntries(active);
        } catch (e) {
            setError("Failed to load lost & found reports");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const addEntry = useCallback(
        async (request: LostFoundRequest) => {
            setActionError(null);
            try {
                const created = await lostFoundService.addLostFound(
                    request
                );
                console.log("Created:", JSON.stringify(created, null, 2));
                setEntries((prev) => [created, ...prev]);
                return created;
            } catch (e) {
                setActionError("Failed to submit report");
                throw e;
            }
        },
        []
    );

    const editEntry = useCallback(
        async (id: number, request: LostFoundRequest) => {
            setActionError(null);
            try {
                const updated = await lostFoundService.editLostFound(
                    id,
                    request
                );
                setEntries((prev) =>
                    prev.map((entry) =>
                        entry.id === updated.id ? updated : entry
                    )
                );
                return updated;
            } catch (e) {
                setActionError("Failed to update report");
                throw e;
            }
        },
        []
    );

    const deleteEntry = useCallback(async (id: number) => {
        setActionError(null);
        try {
            await lostFoundService.deleteLostFound(id);
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
        } catch (e) {
            setActionError("Failed to delete report");
            throw e;
        }
    }, []);

    const markFound = useCallback(async (entry: LostFoundEntry) => {
        setActionError(null);
        try {
            const updated = await lostFoundService.markFound(entry);
            setEntries((prev) =>
                prev.map((e) => (e.id === updated.id ? updated : e))
            );
            return updated;
        } catch (e) {
            setActionError("Failed to mark item as found");
            throw e;
        }
    }, []);

    const claimFound = useCallback(
        async (request: LostFoundClaimRequest) => {
            setActionError(null);
            try {
                const updated = await lostFoundService.claimFound(
                    request
                );
                setEntries((prev) =>
                    prev.map((e) => (e.id === updated.id ? updated : e))
                );
                return updated;
            } catch (e) {
                setActionError("Failed to submit claim");
                throw e;
            }
        },
        []
    );

    return {
        entries,
        loading,
        error,
        actionError,
        refresh: fetchEntries,
        addEntry,
        editEntry,
        deleteEntry,
        markFound,
        claimFound,
    };
}