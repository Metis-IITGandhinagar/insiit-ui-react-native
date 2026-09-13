import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/core/auth/useAuth";
import { CACHE_POLICIES, useCachedResource } from "@/core/cache";
import { lostFoundService } from "../services/lostFoundService";
import {
    LostFoundEntry,
    LostFoundRequest,
    LostFoundClaimRequest,
} from "../services/lostFoundTypes";
import { daysUntilArchive } from "../utils/formatDate";

const fetchEntries = () => lostFoundService.getAllLostFound();

export function useLostFoundData() {
    const { user } = useAuth() as { user?: { email?: string | null } };
    const [actionError, setActionError] = useState<string | null>(null);

    const {
        data,
        loading,
        refreshing,
        error,
        usingCachedData,
        lastUpdatedAt,
        refresh,
        setData,
    } = useCachedResource<LostFoundEntry[]>({
        policy: CACHE_POLICIES.lostFound,
        fetcher: fetchEntries,
    });

    /**
     * The full server list is what gets cached; the archive cutoff is applied here, at
     * render time. Filtering before caching would bake in whatever "today" meant when
     * the copy was written, so a cache read tomorrow would show items that have since
     * archived.
     */
    const entries = useMemo(
        () => (data ?? []).filter((entry) => daysUntilArchive(entry.added_on_timestamp, 7) > 0),
        [data]
    );

    /** Applies a local change to the cached list and writes it straight back to disk. */
    const patchEntries = useCallback(
        (update: (previous: LostFoundEntry[]) => LostFoundEntry[]) => {
            setData((previous) => update(previous ?? []));
        },
        [setData]
    );

    const addEntry = useCallback(
        async (request: LostFoundRequest) => {
            setActionError(null);
            try {
                const created = await lostFoundService.addLostFound(request);
                patchEntries((prev) => [created, ...prev]);
                return created;
            } catch (e) {
                setActionError("Failed to submit report");
                throw e;
            }
        },
        [patchEntries]
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
                    patchEntries((prev) =>
                        prev.map((e) => (e.id === 99999 ? updatedMock : e))
                    );
                    return updatedMock;
                }

                const updated = await lostFoundService.editLostFound(id, request);
                patchEntries((prev) =>
                    prev.map((entry) => (entry.id === updated.id ? updated : entry))
                );
                return updated;
            } catch (e) {
                setActionError("Failed to update report");
                throw e;
            }
        },
        [patchEntries, user?.email]
    );

    const deleteEntry = useCallback(
        async (id: number) => {
            setActionError(null);
            try {
                if (id === 99999) {
                    patchEntries((prev) => prev.filter((entry) => entry.id !== 99999));
                    return;
                }

                await lostFoundService.deleteLostFound(id);
                patchEntries((prev) => prev.filter((entry) => entry.id !== id));
            } catch (e) {
                setActionError("Failed to delete report");
                throw e;
            }
        },
        [patchEntries]
    );

    const markFound = useCallback(
        async (entry: LostFoundEntry) => {
            setActionError(null);
            try {
                if (entry.id === 99999) {
                    const updatedMock: LostFoundEntry = { ...entry, status: "found" };
                    patchEntries((prev) =>
                        prev.map((e) => (e.id === 99999 ? updatedMock : e))
                    );
                    return updatedMock;
                }

                const updated = await lostFoundService.markFound(entry);
                patchEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
                return updated;
            } catch (e) {
                setActionError("Failed to mark item as found");
                throw e;
            }
        },
        [patchEntries]
    );

    const claimFound = useCallback(
        async (request: LostFoundClaimRequest) => {
            setActionError(null);
            try {
                const updated = await lostFoundService.claimFound(request);
                patchEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
                return updated;
            } catch (e) {
                setActionError("Failed to submit claim");
                throw e;
            }
        },
        [patchEntries]
    );

    return {
        entries,
        loading,
        refreshing,
        error: error ? "Failed to load lost & found reports" : null,
        usingCachedData,
        lastUpdatedAt,
        actionError,
        refresh,
        addEntry,
        editEntry,
        deleteEntry,
        markFound,
        claimFound,
    };
}
