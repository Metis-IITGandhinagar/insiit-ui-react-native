// src/features/notifications/services/notificationService.ts
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createMMKV } from 'react-native-mmkv';
import { announcementsService } from '@/features/announcements/services/announcementsService';
import { eventService, parseEventDateTime } from '@/features/events/services/eventService';
import { Event } from '@/features/events/services/searchTypes';
import { AppNotification, ScheduledReminder } from './notificationTypes';

const storage = createMMKV({ id: 'insiit.notifications' });

const READ_IDS_KEY = 'read_ids';
const DISMISSED_IDS_KEY = 'dismissed_ids';
const REMINDERS_KEY = 'scheduled_reminders';

// Configure foreground presentation in compliance with Expo SDK 57
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

let channelConfigured = false;
export async function ensureNotificationChannelAsync(): Promise<void> {
    if (channelConfigured) return;
    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('events_announcements', {
                name: 'Events & Announcements',
                description: 'Updates and reminders for campus events and announcements',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4063F6',
            });
            channelConfigured = true;
        } catch (e) {
            console.warn('Failed to configure Android notification channel:', e);
        }
    }
}

export async function requestNotificationPermissions(): Promise<boolean> {
    try {
        await ensureNotificationChannelAsync();
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === 'granted';
    } catch (e) {
        console.warn('Error checking notification permissions:', e);
        return false;
    }
}

function getStoredStringArray(key: string): string[] {
    const data = storage.getString(key);
    if (!data) return [];
    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveStringArray(key: string, items: string[]): void {
    storage.set(key, JSON.stringify(items));
}

function getStoredReminders(): Record<string, ScheduledReminder> {
    const data = storage.getString(REMINDERS_KEY);
    if (!data) return {};
    try {
        const parsed = JSON.parse(data);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function saveStoredReminders(reminders: Record<string, ScheduledReminder>): void {
    storage.set(REMINDERS_KEY, JSON.stringify(reminders));
}

export const notificationService = {
    requestPermissions: requestNotificationPermissions,

    isReminderSet: (eventId: string): boolean => {
        const reminders = getStoredReminders();
        return Boolean(reminders[eventId]);
    },

    scheduleEventReminder: async (event: Event): Promise<{ success: boolean; message: string }> => {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
            return {
                success: false,
                message: 'Notification permission is required to schedule event reminders.',
            };
        }

        try {
            await ensureNotificationChannelAsync();

            let targetTime: Date | null = null;
            if (event.startDateTime) {
                const parsed = new Date(event.startDateTime);
                if (!isNaN(parsed.getTime())) targetTime = parsed;
            }
            if (!targetTime) {
                targetTime = parseEventDateTime(event.date, event.time);
            }

            const now = Date.now();
            let trigger: Notifications.NotificationTriggerInput;

            if (targetTime && targetTime.getTime() > now) {
                // Schedule 15 minutes before the event
                const fifteenMinutesBefore = new Date(targetTime.getTime() - 15 * 60 * 1000);
                if (fifteenMinutesBefore.getTime() > now) {
                    trigger = {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: fifteenMinutesBefore,
                        channelId: 'events_announcements',
                    };
                } else {
                    // Starts in less than 15 minutes: trigger in 5 seconds
                    trigger = {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: 5,
                        channelId: 'events_announcements',
                    };
                }
            } else {
                // Trigger in 3 seconds as a confirmation notification
                trigger = {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 3,
                    channelId: 'events_announcements',
                };
            }

            const notifId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Upcoming Event: ${event.title}`,
                    body: `Starting soon at ${event.venue || 'campus'} (${event.time || ''})`,
                    data: { eventId: event.id, route: 'Events' },
                    sound: true,
                },
                trigger,
            });

            const reminders = getStoredReminders();
            reminders[event.id] = {
                eventId: event.id,
                notificationId: notifId,
                eventTitle: event.title,
                scheduledFor: targetTime ? targetTime.toISOString() : new Date().toISOString(),
            };
            saveStoredReminders(reminders);

            return {
                success: true,
                message: `Reminder set for "${event.title}".`,
            };
        } catch (error: any) {
            console.error('Error scheduling notification:', error);
            return {
                success: false,
                message: error?.message || 'Could not schedule reminder.',
            };
        }
    },

    cancelEventReminder: async (eventId: string): Promise<boolean> => {
        try {
            const reminders = getStoredReminders();
            const reminder = reminders[eventId];
            if (reminder?.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
            }
            delete reminders[eventId];
            saveStoredReminders(reminders);
            return true;
        } catch (e) {
            console.warn('Error cancelling reminder:', e);
            return false;
        }
    },

    getNotifications: async (): Promise<AppNotification[]> => {
        const readIds = new Set(getStoredStringArray(READ_IDS_KEY));
        const dismissedIds = new Set(getStoredStringArray(DISMISSED_IDS_KEY));
        const reminders = getStoredReminders();

        const notifications: AppNotification[] = [];

        // 1. Announcements
        try {
            const announcements = await announcementsService.getAll();
            for (const item of announcements) {
                const notifId = `announcement-${item.id}`;
                if (dismissedIds.has(notifId)) continue;

                notifications.push({
                    id: notifId,
                    type: 'announcement',
                    title: item.title,
                    body: item.description,
                    timestamp: item.added_on_timestamp || new Date().toISOString(),
                    read: readIds.has(notifId),
                    targetId: String(item.id),
                    targetRoute: 'Announcements',
                });
            }
        } catch (e) {
            console.warn('Could not fetch announcements for notifications:', e);
        }

        // 2. Events
        try {
            const events = await eventService.getAllEvents();
            for (const event of events) {
                const notifId = `event-${event.id}`;
                if (dismissedIds.has(notifId)) continue;

                const hasReminder = Boolean(reminders[event.id]);

                notifications.push({
                    id: notifId,
                    type: hasReminder ? 'reminder' : 'event',
                    title: hasReminder ? `Reminder: ${event.title}` : `Event: ${event.title}`,
                    body: `${event.venue ? `${event.venue} • ` : ''}${event.date} ${event.time}`.trim(),
                    timestamp: event.startDateTime || new Date().toISOString(),
                    read: readIds.has(notifId),
                    targetId: event.id,
                    targetRoute: 'Events',
                    venue: event.venue,
                    eventTime: `${event.date} • ${event.time}`,
                });
            }
        } catch (e) {
            console.warn('Could not fetch events for notifications:', e);
        }

        // Sort latest first
        notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return notifications;
    },

    markAsRead: (notificationId: string): void => {
        const readIds = new Set(getStoredStringArray(READ_IDS_KEY));
        readIds.add(notificationId);
        saveStringArray(READ_IDS_KEY, Array.from(readIds));
    },

    markAllAsRead: (notificationIds: string[]): void => {
        const readIds = new Set(getStoredStringArray(READ_IDS_KEY));
        notificationIds.forEach((id) => readIds.add(id));
        saveStringArray(READ_IDS_KEY, Array.from(readIds));
    },

    dismissNotification: (notificationId: string): void => {
        const dismissed = new Set(getStoredStringArray(DISMISSED_IDS_KEY));
        dismissed.add(notificationId);
        saveStringArray(DISMISSED_IDS_KEY, Array.from(dismissed));
    },

    clearAll: (notificationIds: string[]): void => {
        const dismissed = new Set(getStoredStringArray(DISMISSED_IDS_KEY));
        notificationIds.forEach((id) => dismissed.add(id));
        saveStringArray(DISMISSED_IDS_KEY, Array.from(dismissed));
    },
};
