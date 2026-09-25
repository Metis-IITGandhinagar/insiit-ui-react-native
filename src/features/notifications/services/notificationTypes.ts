// src/features/notifications/services/notificationTypes.ts

export type NotificationType = 'event' | 'announcement' | 'reminder';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    /** ISO 8601 string */
    timestamp: string;
    read: boolean;
    targetId?: string;
    targetRoute?: 'Events' | 'Announcements';
    scheduledNotificationId?: string;
    venue?: string;
    eventTime?: string;
}

export interface ScheduledReminder {
    eventId: string;
    notificationId: string;
    eventTitle: string;
    scheduledFor: string;
}
