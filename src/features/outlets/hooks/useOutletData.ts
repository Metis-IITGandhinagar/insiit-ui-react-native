import { CACHE_POLICIES, useCachedResource } from "@/core/cache";
import { Outlet } from "../services/outletTypes";
import { outletService } from "../services/outletService";

const fetchOutlets = () => outletService.getAllOutlets();

export function useOutletData() {
    // Outlet names, hours and menus change a few times a semester, so the cached copy
    // is served first and the network only confirms it.
    const { data, loading, refreshing, error, usingCachedData, lastUpdatedAt, refresh } =
        useCachedResource<Outlet[]>({
            policy: CACHE_POLICIES.outlets,
            fetcher: fetchOutlets,
        });

    return {
        outlets: data ?? [],
        loading,
        refreshing,
        error: error ? "Failed to load outlets" : null,
        usingCachedData,
        lastUpdatedAt,
        refresh,
    };
}
