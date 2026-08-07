export type LostFoundStatus = "lost" | "found" | "claimed_to_be_found";

export interface LostFoundClaim {
    id: number;
    item_name: string;
    claimed_by_email: string;
    remarks: string;
    /** RFC 3339 string — see core/api/backendTime. */
    claim_timestamp: string;
}

export interface LostFoundEntry {
    id: number;
    item_name: string;
    description: string;
    /** RFC 3339 string — see core/api/backendTime. */
    added_on_timestamp: string;
    added_by_email: string;
    status: LostFoundStatus;
    found_claims: LostFoundClaim[];
    img_urls: string[];
}

export interface LostFoundRequest {
    item_name: string;
    description: string;
    base64_images: string[];
}

export interface LostFoundClaimRequest {
    id: number;
    item_name: string;
    remarks: string;
}