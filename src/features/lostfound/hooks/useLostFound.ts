import { useState, useEffect, useCallback } from 'react';
import { LostFoundEntry, lostFoundService } from '../services/lostFoundService';

export const useLostFound = () => {
    const [entries, setEntries] = useState<LostFoundEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await lostFoundService.getAll();
            // Newest first; the backend returns table order.
            setEntries(
                [...data].sort(
                    (a, b) => (b.added_on_timestamp ?? 0) - (a.added_on_timestamp ?? 0)
                )
            );
        } catch (err: any) {
            setError(err?.message || 'Failed to load lost & found items');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { entries, loading, error, refresh };
};
