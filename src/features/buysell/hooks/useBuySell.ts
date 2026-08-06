import { useState, useEffect, useCallback } from 'react';
import { BuySellEntry, buySellService } from '../services/buySellService';

export const useBuySell = () => {
    const [entries, setEntries] = useState<BuySellEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await buySellService.getAll();
            // Newest first; the backend returns table order.
            setEntries(
                [...data].sort(
                    (a, b) => (b.added_on_timestamp ?? 0) - (a.added_on_timestamp ?? 0)
                )
            );
        } catch (err: any) {
            setError(err?.message || 'Failed to load listings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { entries, loading, error, refresh };
};
