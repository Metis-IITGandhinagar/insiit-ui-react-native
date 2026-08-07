import { useState, useEffect, useCallback } from 'react';
import { AnnouncementEntry, announcementsService } from '../services/announcementsService';

export const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setAnnouncements(await announcementsService.getAll());
        } catch (err: any) {
            setError(err?.message || 'Failed to load announcements');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { announcements, loading, error, refresh };
};
