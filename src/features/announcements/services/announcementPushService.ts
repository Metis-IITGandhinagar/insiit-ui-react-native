// src/features/announcements/services/announcementPushService.ts
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createMMKV } from 'react-native-mmkv';
import type { AnnouncementEntry } from './announcementsService';

const storage = createMMKV({ id: 'insiit.announcements' });
const SEEN_IDS_KEY = 'seen_announcement_ids';
const SEEDED_KEY = 'announcement_push_seeded';
const MAX_REMEMBERED_IDS = 100;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

function getSeenIds(): Set<string> {
    const data = storage.getString(SEEN_IDS_KEY);
    if (!data) return new Set();
    try {
        const parsed = JSON.parse(data);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

function saveSeenIds(ids: Set<string>): void {
    storage.set(SEEN_IDS_KEY, JSON.stringify(Array.from(ids).slice(0, MAX_REMEMBERED_IDS)));
}

/**
 * Present an OS-level notification for each announcement the user hasn't seen yet.
 * The announcements list is newest-first; we remember the ids we've seen so the
 * same announcements aren't notified repeatedly. On the first fetch after
 * install we remember the current announcements without notifying — those are
 * visible on the Announcements screen and shouldn't trigger a burst of pushes
 * when opening the app.
 */
export async function notifyNewAnnouncements(announcements: AnnouncementEntry[]): Promise<number> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return 0;
    try {
        if (storage.getBoolean(SEEDED_KEY) !== true) {
            saveSeenIds(new Set(announcements.map((a) => String(a.id))));
            storage.set(SEEDED_KEY, true);
            return 0;
        }

        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') return 0;

        const seenBefore = getSeenIds();
        const currentIds = announcements.map((a) => String(a.id));
        const newOnes = announcements.filter((a) => !seenBefore.has(String(a.id)));

        for (const announcement of newOnes) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: announcement.title,
                    body: announcement.description,
                    data: { route: 'Announcements' },
                },
                trigger: null,
            });
        }

        // Newest ids first so the set keeps the most recent announcements.
        saveSeenIds(new Set([...currentIds, ...seenBefore]));

        return newOnes.length;
    } catch (error) {
        console.warn('Could not notify new announcements:', error);
        return 0;
    }
}
