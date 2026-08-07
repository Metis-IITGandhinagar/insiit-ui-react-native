// src/features/buysell/services/buySellService.ts
import { apiClient } from '@/core/api/apiClient';

/** Mirrors `BuySellStatus` (serde renames to snake_case). */
export type BuySellStatus = 'selling' | 'sold';

export interface BidEntry {
    item_id: number;
    item_name: string;
    bid_by_email: string;
    bid_amount_in_rs: number;
    remarks: string;
    /** RFC 3339 string — see backendTime.ts. */
    bid_timestamp: string;
}

/** Mirrors `BuySellEntry` in the backend (src/schemas/buy_sell_schemas.rs). */
export interface BuySellEntry {
    id: number;
    item_name: string;
    description: string;
    added_on_timestamp: string;
    added_by_email: string;
    status: BuySellStatus;
    bids: BidEntry[];
    img_urls: string[];
}

export interface BuySellRequest {
    item_name: string;
    description: string;
    /** Raw base64 payloads; the backend saves them and returns img_urls. */
    base64_images: string[];
}

export const buySellService = {
    getAll: async (): Promise<BuySellEntry[]> => {
        const response = await apiClient.get<BuySellEntry[]>('/buy-sell');
        return Array.isArray(response.data) ? response.data : [];
    },

    list: async (payload: BuySellRequest): Promise<BuySellEntry> => {
        const response = await apiClient.post<BuySellEntry>('/buy-sell', payload);
        return response.data;
    },

    /**
     * Seller only. NOTE: the backend's `edit_buy_sell` updates item_name and
     * description only — `base64_images` in the body is ignored, so existing photos
     * can't be replaced or removed through this endpoint.
     */
    edit: async (id: number, payload: BuySellRequest): Promise<BuySellEntry> => {
        const response = await apiClient.put<BuySellEntry>(`/buy-sell/${id}`, payload);
        return response.data;
    },

    /** Seller only — the backend scopes this by added_by_email. */
    markSold: async (entry: BuySellEntry): Promise<BuySellEntry> => {
        const response = await apiClient.put<BuySellEntry>('/buy-sell/mark-sold', entry);
        return response.data;
    },

    /** Only accepted while the item is still 'selling'. */
    placeBid: async (
        entry: BuySellEntry,
        amountInRs: number,
        remarks: string
    ): Promise<BuySellEntry> => {
        const response = await apiClient.post<BuySellEntry>('/buy-sell/bid', {
            item_id: entry.id,
            item_name: entry.item_name,
            bid_amount_in_rs: amountInRs,
            remarks,
        });
        return response.data;
    },

    remove: async (id: number): Promise<void> => {
        await apiClient.delete(`/buy-sell/${id}`);
    },
};
