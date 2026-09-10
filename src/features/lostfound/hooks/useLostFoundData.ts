import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/core/auth/useAuth";
import { lostFoundService } from "../services/lostFoundService";
import {
    LostFoundEntry,
    LostFoundRequest,
    LostFoundClaimRequest,
} from "../services/lostFoundTypes";
import { daysUntilArchive } from "../utils/formatDate";

export function useLostFoundData() {
    const { user } = useAuth() as { user?: { email?: string | null } };
    const [entries, setEntries] = useState<LostFoundEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let data: LostFoundEntry[] = [];
            try {
                data = await lostFoundService.getAllLostFound();
            } catch (err) {
                console.warn("Backend fetch failed, relying on mock item", err);
            }

            const active = data.filter(
                (entry) => daysUntilArchive(entry.added_on_timestamp, 7) > 0
            );
        } catch (e) {
            setError("Failed to load lost & found reports");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

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
                if (id === 99999) {
                    const updatedMock: LostFoundEntry = {
                        id: 99999,
                        item_name: request.item_name,
                        description: request.description,
                        added_by_email: user?.email || "janil.jain@iitgn.ac.in",
                        added_on_timestamp: new Date().toISOString(),
                        status: "lost",
                        img_urls: request.base64_images?.length
                            ? request.base64_images
                            : ["https://placehold.co/600x400?text=Test+Item"],
                        found_claims: [],
                    };
                    setEntries((prev) =>
                        prev.map((e) => (e.id === 99999 ? updatedMock : e))
                    );
                    return updatedMock;
                }

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
        [user?.email]
    );

    const deleteEntry = useCallback(async (id: number) => {
        setActionError(null);
        try {
            if (id === 99999) {
                setEntries((prev) => prev.filter((entry) => entry.id !== 99999));
                return;
            }

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
            if (entry.id === 99999) {
                const updatedMock: LostFoundEntry = {
                    ...entry,
                    status: "found",
                };
                setEntries((prev) =>
                    prev.map((e) => (e.id === 99999 ? updatedMock : e))
                );
                return updatedMock;
            }

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