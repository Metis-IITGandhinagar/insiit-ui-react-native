// src/core/api/backendTime.ts
//
// The Rust backend does not encode datetimes consistently — see notes.md
// ("Backend datetime encoding"). Depending on the field you get:
//
//   * an RFC 3339 string      e.g. "2026-08-06T12:30:00Z"   (events)
//   * unix SECONDS as number  e.g. 1786018200               (*_timestamp fields)
//   * a 9-element array       [y, ordinal, h, m, s, ns, ...] (fields the backend
//                                                             forgot to annotate)
//
// These helpers accept all three so a single unannotated field cannot crash a
// screen. Delete the array branch once the backend annotates everything.

type BackendTime = string | number | number[] | null | undefined;

/** Parses any of the three encodings into a Date, or null if unusable. */
export const parseBackendInstant = (value: BackendTime): Date | null => {
    if (value === null || value === undefined) return null;

    // Unix seconds — note JS Date wants milliseconds.
    if (typeof value === 'number') {
        const date = new Date(value * 1000);
        return isNaN(date.getTime()) ? null : date;
    }

    if (typeof value === 'string') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }

    // time crate's non-human-readable form: [year, dayOfYear, hour, min, sec, nanos, ...]
    if (Array.isArray(value) && value.length >= 6) {
        const [year, ordinal, hour, minute, second] = value;
        const date = new Date(Date.UTC(year, 0, 1, hour, minute, second));
        date.setUTCDate(ordinal);
        return isNaN(date.getTime()) ? null : date;
    }

    return null;
};

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
