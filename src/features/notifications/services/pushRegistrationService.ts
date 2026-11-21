import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { createMMKV } from 'react-native-mmkv';
import { apiClient } from '@/core/api/apiClient';

const DEVICE_ID_KEY = 'push_device_id';
const CHANNEL_ID = 'events_announcements';
const navigationStorage = createMMKV({ id: 'insiit.notifications' });
const settingsStorage = createMMKV({ id: 'insiit.settings' });
const PENDING_EVENT_KEY = 'pending_push_event_id';
const EVENT_REMINDERS_KEY = 'event_reminders_enabled';
const EVENT_REMINDERS_USER_OFF_KEY = 'event_reminders_user_off';

export function setPendingPushEvent(eventId: string): void {
    navigationStorage.set(PENDING_EVENT_KEY, eventId);
}

export function consumePendingPushEvent(): string | undefined {
    const eventId = navigationStorage.getString(PENDING_EVENT_KEY);
    if (eventId) navigationStorage.remove(PENDING_EVENT_KEY);
    return eventId;
}

async function getDeviceId(): Promise<string> {
    let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (!id) {
        id = Crypto.randomUUID();
        await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    }
    return id;
}

export function isEventRemindersUserOff(): boolean {
    // Older app versions only stored EVENT_REMINDERS_KEY. Preserve an existing
    // opt-out even when the newer explicit marker has not been written yet.
    return (
        settingsStorage.getBoolean(EVENT_REMINDERS_USER_OFF_KEY) === true ||
        settingsStorage.getBoolean(EVENT_REMINDERS_KEY) === false
    );
}

export function getEffectiveRemindersEnabled(): boolean {
    if (isEventRemindersUserOff()) return false;
    const saved = settingsStorage.getBoolean(EVENT_REMINDERS_KEY);
    if (saved === false) return false;
    return true;
}

export function setLocalRemindersPreference(enabled: boolean): void {
    settingsStorage.set(EVENT_REMINDERS_KEY, enabled);
    if (enabled) {
        settingsStorage.remove(EVENT_REMINDERS_USER_OFF_KEY);
    } else {
        settingsStorage.set(EVENT_REMINDERS_USER_OFF_KEY, true);
    }
}

export function autoEnableRemindersIfAllowed(): void {
    if (isEventRemindersUserOff()) return;
    settingsStorage.set(EVENT_REMINDERS_KEY, true);
}

export async function registerPushDevice(): Promise<'registered' | 'denied' | 'unsupported'> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return 'unsupported';

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
            name: 'Events & Announcements',
            description: 'Campus events (10 min before) and announcements',
            importance: Notifications.AndroidImportance.HIGH,
        });
    }

    let permission = await Notifications.getPermissionsAsync();
    if (permission.status !== 'granted' && permission.canAskAgain) {
        permission = await Notifications.requestPermissionsAsync();
        navigationStorage.set('notification_permission_asked', true);
    }
    if (permission.status !== 'granted') return 'denied';

    autoEnableRemindersIfAllowed();

    try {
        const token = await messaging().getToken();
        if (!token) throw new Error('Firebase did not return an FCM token');
        await apiClient.post('/push/devices', {
            device_id: await getDeviceId(),
            token,
            reminders_enabled: getEffectiveRemindersEnabled(),
        });
        return 'registered';
    } catch (error) {
        console.warn('Could not register push notification device:', error);
        return 'denied';
    }
}

export async function setEventReminderPreference(enabled: boolean): Promise<void> {
    setLocalRemindersPreference(enabled);
    await apiClient.put('/push/preferences', { reminders_enabled: enabled });
}

export async function unregisterPushDevice(): Promise<void> {
    const id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (!id) return;
    try {
        await apiClient.delete(`/push/devices/${encodeURIComponent(id)}`);
    } catch (error) {
        console.warn('Could not unregister push notification device:', error);
    }
}
