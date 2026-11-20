import { apiClient } from '@/core/api/apiClient';
import type {
    Card,
    Catalogue,
    ChatPage,
    FeedPage,
    MyTrips,
    NotificationPage,
    NotifyPrefs,
    Profile,
    RideRequest,
} from './cabshareTypes';

/**
 * The backend answers a refused action with the reason as plain text ("you already
 * have a trip at that time…"). axios only says "Request failed with status code 400",
 * so pull the backend's words out for the alert.
 */
export const cabshareError = (error: any, fallback = 'Something went wrong. Try again.'): string => {
    const data = error?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data.error === 'string') return data.error;
    if (error?.message === 'Network Error') return 'No connection. Check your internet and try again.';
    return fallback;
};

export const cabshareService = {
    async catalogue(): Promise<Catalogue> {
        const { data } = await apiClient.get('/cabshare/catalogue');
        return data;
    },

    async feed(params: { direction?: string; to?: string; after?: string | null; limit?: number } = {}): Promise<FeedPage> {
        const { data } = await apiClient.get('/cabshare/feed', {
            params: { ...params, after: params.after ?? undefined },
        });
        return data;
    },

    async post(request: RideRequest): Promise<Card> {
        const { data } = await apiClient.post('/cabshare/requests', request);
        return data;
    },

    async join(request: RideRequest): Promise<Card> {
        const { data } = await apiClient.post('/cabshare/join', request);
        return data;
    },

    async myTrips(pastBefore?: string | null): Promise<MyTrips> {
        const { data } = await apiClient.get('/cabshare/trips', {
            params: { past_before: pastBefore ?? undefined },
        });
        return data;
    },

    async clearHistory(): Promise<number> {
        const { data } = await apiClient.post('/cabshare/trips/clear-history');
        return data.cleared;
    },

    async card(request: number): Promise<Card> {
        const { data } = await apiClient.get(`/cabshare/requests/${request}`);
        return data;
    },

    async cancel(request: number): Promise<void> {
        await apiClient.delete(`/cabshare/requests/${request}`);
    },

    async dismissNotice(request: number): Promise<void> {
        await apiClient.post(`/cabshare/requests/${request}/dismiss`);
    },

    async setQuote(request: number, quote: number | null): Promise<Card> {
        const { data } = await apiClient.put(`/cabshare/requests/${request}/quote`, { quote });
        return data;
    },

    async messages(request: number, before?: string | null): Promise<ChatPage> {
        const { data } = await apiClient.get(`/cabshare/requests/${request}/messages`, {
            params: { before: before ?? undefined },
        });
        return data;
    },

    async send(request: number, body: string): Promise<ChatPage> {
        const { data } = await apiClient.post(`/cabshare/requests/${request}/messages`, { body });
        return data;
    },

    async checkIn(request: number, lat: number, lng: number): Promise<Card> {
        const { data } = await apiClient.post(`/cabshare/requests/${request}/checkin`, { lat, lng });
        return data;
    },

    async confirm(request: number): Promise<Card> {
        const { data } = await apiClient.post(`/cabshare/requests/${request}/confirm`);
        return data;
    },

    async report(request: number, handle: string): Promise<Card> {
        const { data } = await apiClient.post(`/cabshare/requests/${request}/report`, { handle });
        return data;
    },

    async profile(): Promise<Profile> {
        const { data } = await apiClient.get('/cabshare/me');
        return data;
    },

    async setGender(gender: Profile['gender']): Promise<Profile> {
        const { data } = await apiClient.put('/cabshare/me/gender', { gender });
        return data;
    },

    async blocks(): Promise<string[]> {
        const { data } = await apiClient.get('/cabshare/blocks');
        return data.blocked;
    },

    async block(email: string): Promise<string[]> {
        const { data } = await apiClient.post('/cabshare/blocks', { email });
        return data.blocked;
    },

    async unblock(email: string): Promise<string[]> {
        const { data } = await apiClient.post('/cabshare/blocks/remove', { email });
        return data.blocked;
    },

    async notifications(before?: number | null): Promise<NotificationPage> {
        const { data } = await apiClient.get('/cabshare/notifications', {
            params: { before: before ?? undefined },
        });
        return data;
    },

    async readNotifications(ids?: number[]): Promise<number> {
        const { data } = await apiClient.post('/cabshare/notifications/read', { ids: ids ?? null });
        return data.unread;
    },

    async notifyPrefs(): Promise<NotifyPrefs> {
        const { data } = await apiClient.get('/cabshare/notifications/settings');
        return data;
    },

    async setNotifyPrefs(changes: Partial<NotifyPrefs>): Promise<NotifyPrefs> {
        const { data } = await apiClient.put('/cabshare/notifications/settings', changes);
        return data;
    },
};
