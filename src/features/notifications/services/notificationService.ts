// src/features/notifications/services/notificationService.ts
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createMMKV } from 'react-native-mmkv';
import { announcementsService } from '@/features/announcements/services/announcementsService';
import { eventService, parseEventDateTime } from '@/features/events/services/eventService';
import { Event } from '@/features/events/services/searchTypes';
import { AppNotification, ScheduledReminder } from './notificationTypes';
import { backendInstantMs } from '@/core/api/backendTime';

const storage = createMMKV({ id: 'insiit.notifications' });
const settingsStorage = createMMKV({ id: 'insiit.settings' });

const READ_IDS_KEY = 'read_ids';
const DISMISSED_IDS_KEY = 'dismissed_ids';
const REMINDERS_KEY = 'scheduled_reminders';
const PERMISSION_ASKED_KEY = 'notification_permission_asked';
const EVENT_REMINDERS_KEY = 'event_reminders_enabled';

// Configure foreground presentation (Expo SDK 57+)
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
    if (Platform.OS === 'android') {
        if (channelConfigured) return;
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

/** Ask permission only once (for existing users after Play Store update). */
export async function askPermissionOnceOnLaunch(): Promise<void> {
    const alreadyAsked = storage.getBoolean(PERMISSION_ASKED_KEY);
    if (alreadyAsked) return;

    storage.set(PERMISSION_ASKED_KEY, true);

    const remindersEnabled = settingsStorage.getBoolean(EVENT_REMINDERS_KEY) ?? false;
    if (!remindersEnabled) return;

    await requestNotificationPermissions();
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

            if (!targetTime || targetTime.getTime() <= Date.now()) {
                return { success: false, message: 'This event has already started or has an invalid date.' };
            }

            const now = Date.now();

            if (!targetTime || targetTime.getTime() <= now) {
                return { success: false, message: 'This event has already started or has an invalid date.' };
            }

            const tenMinutesBefore = new Date(targetTime.getTime() - 10 * 60 * 1000);

            // Already inside the 10-minute window → skip (prevents repeat notifications)
            if (tenMinutesBefore.getTime() <= now) {
                return {
                    success: false,
                    message: 'Event is starting too soon to schedule a reminder.',
                };
            }

            const trigger: Notifications.NotificationTriggerInput = {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: tenMinutesBefore,
                channelId: 'events_announcements',
            };

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
                scheduledFor: targetTime.toISOString(),
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

    /** Schedule / cancel reminders for all future events according to the Settings toggle. */
    syncAllEventReminders: async (events: Event[]): Promise<void> => {
        const enabled = settingsStorage.getBoolean(EVENT_REMINDERS_KEY) ?? false;

        if (!enabled) {
            const reminders = getStoredReminders();
            for (const eventId of Object.keys(reminders)) {
                await notificationService.cancelEventReminder(eventId);
            }
            return;
        }

        const now = Date.now();
        const futureEvents = events.filter((e) => {
            let target: Date | null = null;
            if (e.startDateTime) {
                const parsed = new Date(e.startDateTime);
                if (!isNaN(parsed.getTime())) target = parsed;
            }
            if (!target) target = parseEventDateTime(e.date, e.time);
            return target && target.getTime() > now;
        });

        // iOS silently drops local notifications beyond 64
        const MAX_SCHEDULED = 60;
        const toSchedule = futureEvents
            .sort((a, b) => {
                // soonest first
                const ta = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
                const tb = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
                return ta - tb;
            })
            .slice(0, MAX_SCHEDULED);

        const futureIds = new Set(futureEvents.map((e) => e.id));

        // Cancel reminders for events that no longer exist or already started
        const currentReminders = getStoredReminders();
        for (const eventId of Object.keys(currentReminders)) {
            if (!futureIds.has(eventId)) {
                await notificationService.cancelEventReminder(eventId);
            }
        }

        // Schedule missing ones
        for (const event of futureEvents) {
            if (!notificationService.isReminderSet(event.id)) {
                await notificationService.scheduleEventReminder(event);
            }
        }
    },

    getNotifications: async (): Promise<AppNotification[]> => {
        const readIds = new Set(getStoredStringArray(READ_IDS_KEY));
        const dismissedIds = new Set(getStoredStringArray(DISMISSED_IDS_KEY));
        const reminders = getStoredReminders();

        try {
            const scheduledIds = new Set(
                (await Notifications.getAllScheduledNotificationsAsync()).map((item) => item.identifier)
            );
            let changed = false;
            for (const [eventId, reminder] of Object.entries(reminders)) {
                if (!scheduledIds.has(reminder.notificationId)) {
                    delete reminders[eventId];
                    changed = true;
                }
            }
            if (changed) saveStoredReminders(reminders);
        } catch (e) {
            console.warn('Could not reconcile scheduled event reminders:', e);
        }

        const notifications: AppNotification[] = [];

        // Announcements
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
                    timestamp: item.added_on_timestamp,
                    read: readIds.has(notifId),
                    targetId: String(item.id),
                    targetRoute: 'Announcements',
                });
            }
        } catch (e) {
            console.warn('Could not fetch announcements for notifications:', e);
        }

        // Event reminders (only when user has opted in)
        if (Object.keys(reminders).length > 0) {
            try {
                const events = await eventService.getAllEvents();
                const eventById = new Map(events.map((event) => [event.id, event]));
                for (const [eventId, reminder] of Object.entries(reminders)) {
                    const event = eventById.get(eventId);
                    if (!event) continue;
                    const notifId = `event-${event.id}`;
                    if (dismissedIds.has(notifId)) continue;
                    notifications.push({
                        id: notifId,
                        type: 'reminder',
                        title: `Reminder: ${event.title}`,
                        body: `${event.venue ? `${event.venue} • ` : ''}${event.date} ${event.time}`.trim(),
                        timestamp: reminder.scheduledFor,
                        read: readIds.has(notifId),
                        targetId: event.id,
                        targetRoute: 'Events',
                        venue: event.venue,
                        eventTime: `${event.date} • ${event.time}`,
                        scheduledNotificationId: reminder.notificationId,
                    });
                }
            } catch (e) {
                console.warn('Could not fetch events for reminders:', e);
            }
        }

        notifications.sort((a, b) => backendInstantMs(b.timestamp) - backendInstantMs(a.timestamp));
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
        const reminderEventId = notificationId.startsWith('event-')
            ? notificationId.slice('event-'.length)
            : undefined;
        if (reminderEventId) {
            const reminders = getStoredReminders();
            const reminder = reminders[reminderEventId];
            if (reminder?.notificationId) {
                void Notifications.cancelScheduledNotificationAsync(reminder.notificationId).catch((e) =>
                    console.warn('Could not cancel dismissed event reminder:', e)
                );
            }
            delete reminders[reminderEventId];
            saveStoredReminders(reminders);
        }
        const dismissed = new Set(getStoredStringArray(DISMISSED_IDS_KEY));
        dismissed.add(notificationId);
        saveStringArray(DISMISSED_IDS_KEY, Array.from(dismissed));
    },

    clearAll: (notificationIds: string[]): void => {
        notificationIds.forEach((id) => {
            if (id.startsWith('event-')) {
                const reminders = getStoredReminders();
                const eventId = id.slice('event-'.length);
                const reminder = reminders[eventId];
                if (reminder?.notificationId) {
                    void Notifications.cancelScheduledNotificationAsync(reminder.notificationId).catch((e) =>
                        console.warn('Could not cancel cleared event reminder:', e)
                    );
                }
                delete reminders[eventId];
                saveStoredReminders(reminders);
            }
        });
        const dismissed = new Set(getStoredStringArray(DISMISSED_IDS_KEY));
        notificationIds.forEach((id) => dismissed.add(id));
        saveStringArray(DISMISSED_IDS_KEY, Array.from(dismissed));
    },
};