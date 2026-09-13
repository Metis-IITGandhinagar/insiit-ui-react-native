import { apiClient } from "@/core/api/apiClient";
import { toBackendTimestamp } from "@/core/api/backendTime";
import {
    LostFoundEntry,
    LostFoundRequest,
    LostFoundClaimRequest,
} from "./lostFoundTypes";

export const lostFoundService = {
    async getAllLostFound(): Promise<LostFoundEntry[]> {
        const { data } = await apiClient.get("/lost-found");
        return data;
    },

    async getLostFoundById(id: number): Promise<LostFoundEntry> {
        const { data } = await apiClient.get(`/lost-found/${id}`);
        return data;
    },

    async addLostFound(
        request: LostFoundRequest
    ): Promise<LostFoundEntry> {
        const { data } = await apiClient.post("/lost-found", request);
        return data;
    },

    async editLostFound(
        id: number,
        request: LostFoundRequest
    ): Promise<LostFoundEntry> {
        const { data } = await apiClient.put(
            `/lost-found/${id}`,
            request
        );
        return data;
    },

    async deleteLostFound(id: number): Promise<void> {
        await apiClient.delete(`/lost-found/${id}`);
    },

    async markFound(entry: LostFoundEntry): Promise<LostFoundEntry> {
        const { data } = await apiClient.put(
            "/lost-found/mark-found",
            entry
        );
        return data;
    },

    async claimFound(
        request: LostFoundClaimRequest
    ): Promise<LostFoundEntry> {
        // The backend deserializes this straight into the LostFoundClaim struct.
        // `claimed_by_email` is overwritten server-side from the auth token, but the
        // field must still be present in the JSON.
        //
        // `claim_timestamp` has to be an RFC 3339 STRING — the field is
        // `#[serde(with = "time::serde::rfc3339")]`, like every other datetime on this
        // API (see core/api/backendTime). Sending unix seconds made serde reject the
        // whole body, so every claim came back as "Failed to submit claim".
        const { data } = await apiClient.post("/lost-found/claim-found", {
            id: request.id,
            item_name: request.item_name,
            remarks: request.remarks,
            claimed_by_email: "",
            claim_timestamp: toBackendTimestamp(new Date()),
        });
        return data;
    },
};