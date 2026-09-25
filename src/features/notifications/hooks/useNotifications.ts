// src/features/notifications/hooks/useNotifications.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { notificationService } from '../services/notificationService';
import { AppNotification } from '../services/notificationTypes';
import { Event } from '@/features/events/services/searchTypes';

export function useNotifications() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (e) {
            console.warn('Failed to load notifications:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await loadNotifications();
    }, [loadNotifications]);

    const unreadCount = useMemo(() => {
        return notifications.filter((n) => !n.read).length;
    }, [notifications]);

    const isReminderSet = useCallback((eventId: string) => {
        return notificationService.isReminderSet(eventId);
    }, []);

    const toggleReminder = useCallback(
        async (event: Event): Promise<{ success: boolean; message: string }> => {
            const alreadySet = notificationService.isReminderSet(event.id);
            if (alreadySet) {
                await notificationService.cancelEventReminder(event.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.targetId === event.id && n.type === 'reminder'
                            ? { ...n, type: 'event', title: `Event: ${event.title}` }
                            : n
                    )
                );
                return { success: true, message: `Removed reminder for "${event.title}".` };
            } else {
                const res = await notificationService.scheduleEventReminder(event);
                if (res.success) {
                    setNotifications((prev) =>
                        prev.map((n) =>
                            n.targetId === event.id
                                ? { ...n, type: 'reminder', title: `Reminder: ${event.title}` }
                                : n
                        )
                    );
                }
                return res;
            }
        },
        []
    );

    const markAsRead = useCallback((notificationId: string) => {
        notificationService.markAsRead(notificationId);
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        const ids = notifications.map((n) => n.id);
        notificationService.markAllAsRead(ids);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, [notifications]);

    const dismissNotification = useCallback((notificationId: string) => {
        notificationService.dismissNotification(notificationId);
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, []);

    const clearAll = useCallback(() => {
        const ids = notifications.map((n) => n.id);
        notificationService.clearAll(ids);
        setNotifications([]);
    }, [notifications]);

    return {
        notifications,
        loading,
        refreshing,
        unreadCount,
        isReminderSet,
        toggleReminder,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll,
        refresh,
    };
}
