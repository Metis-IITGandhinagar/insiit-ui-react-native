import { useState, useEffect, useCallback } from 'react';
import { Outlet, outletsService } from '../services/outletsService';

export const useOutlets = () => {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setOutlets(await outletsService.getAll());
        } catch (err: any) {
            setError(err?.message || 'Failed to load outlets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { outlets, loading, error, refresh };
};
