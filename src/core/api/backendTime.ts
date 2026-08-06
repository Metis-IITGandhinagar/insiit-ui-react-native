// src/core/api/backendTime.ts
//
// Every datetime the Rust backend sends is an RFC 3339 string
// (`#[serde(with = "time::serde::rfc3339")]`), e.g. "2026-08-06T12:30:00Z".
//
// Numbers are still tolerated on the way in so a field that predates the convention
// can't blank out a screen — but they're read as unix SECONDS, matching what the
// backend used to send.

type BackendTime = string | number | null | undefined;

/** Parses a backend timestamp into a Date, or null if unusable. */
export const parseBackendInstant = (value: BackendTime): Date | null => {
    if (value === null || value === undefined) return null;

    // Legacy unix seconds; JS Date takes milliseconds.
    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    return isNaN(date.getTime()) ? null : date;
};

/** Date -> the RFC 3339 string the API expects on writes. */
export const toBackendTimestamp = (date: Date): string => date.toISOString();

/**
 * Milliseconds since epoch, or 0 when unparseable — for sorting.
 * Don't subtract the raw values: they're strings, and `"2026-…" - "2026-…"` is NaN,
 * which makes Array.sort silently do nothing.
 */
export const backendInstantMs = (value: BackendTime): number =>
    parseBackendInstant(value)?.getTime() ?? 0;

/** "6 Aug 2026", or "" when the value can't be parsed. */
export const formatBackendDate = (value: BackendTime): string => {
    const date = parseBackendInstant(value);
    if (!date) return '';
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

/** "12:30 pm", or "" when the value can't be parsed. */
export const formatBackendTime = (value: BackendTime): string => {
    const date = parseBackendInstant(value);
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/** "6 Aug, 12:30 pm" — for list rows. */
export const formatBackendDateTime = (value: BackendTime): string => {
    const date = parseBackendInstant(value);
    if (!date) return '';
    const day = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    return `${day}, ${formatBackendTime(value)}`;
};
