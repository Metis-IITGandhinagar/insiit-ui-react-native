import { parseBackendInstant } from '@/core/api/backendTime';
import type { Direction, Place, PriceSource, Vehicle } from '../services/cabshareTypes';

const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** "Today", "Tomorrow", or "Sat 14 Nov". */
export const dayLabel = (iso: string): string => {
    const date = parseBackendInstant(iso);
    if (!date) return '';
    const days = Math.round((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
};

/** "6:30 pm". */
export const timeLabel = (iso: string): string => {
    const date = parseBackendInstant(iso);
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const whenLabel = (iso: string): string => `${dayLabel(iso)}, ${timeLabel(iso)}`;

/** "in 2 h 10 min", "in 5 min", "left 20 min ago". */
export const untilLabel = (iso: string): string => {
    const date = parseBackendInstant(iso);
    if (!date) return '';
    const minutes = Math.round((date.getTime() - Date.now()) / 60000);
    const span = (m: number) => {
        const h = Math.floor(m / 60);
        const rest = m % 60;
        if (h >= 24) return `${Math.round(h / 24)} d`;
        return h ? `${h} h${rest ? ` ${rest} min` : ''}` : `${rest} min`;
    };
    return minutes >= 0 ? `in ${span(minutes)}` : `left ${span(-minutes)} ago`;
};

/** Same local day as `day` (a Date at local midnight). */
export const onDay = (iso: string, day: Date): boolean => {
    const date = parseBackendInstant(iso);
    return !!date && startOfDay(date).getTime() === startOfDay(day).getTime();
};

export const rupees = (n: number | null | undefined): string =>
    n === null || n === undefined ? '—' : `₹${Math.round(n).toLocaleString('en-IN')}`;

export const vehicleLabel = (v: Vehicle | null | undefined): string => (v === 'auto' ? 'Auto' : 'Cab');

/** Where the ride goes, from the rider's side: "IITGN → Airport" or back. */
export const routeLabel = (direction: Direction, place: string): string =>
    direction === 'from_campus' ? `Campus → ${place}` : `${place} → Campus`;

export const priceNote = (source: PriceSource, quotes: number): string => {
    switch (source) {
        case 'quote_final':
            return 'From the Ola/Uber price a rider entered for this ride';
        case 'quote':
            return `From ${quotes} Ola/Uber price${quotes === 1 ? '' : 's'} riders entered`;
        case 'riders':
            return `Adjusted to ${quotes} recent Ola/Uber prices from riders`;
        default:
            return 'Estimated from the meter rate card';
    }
};

export const noticeText = (notice: string | null): string | null => {
    switch (notice) {
        case 'moved':
            return 'Your ride changed. Check your new group and time.';
        case 'partner_left':
            return 'Your co-rider cancelled. You are waiting again; we will group you at one of your times.';
        case 'displaced':
            return 'A more reliable rider took your seat. You are waiting again at your times.';
        case 'regrouped':
            return 'Final groups were set at 15 minutes to go, and your co-riders changed.';
        default:
            return null;
    }
};

export const genderLabel = (g?: string | null): string | null =>
    g === 'woman' ? 'Woman' : g === 'man' ? 'Man' : g === 'non_binary' ? 'Non-binary' : null;

/** Stops a rider can pick, nearest campus first, by branch. */
export const pickableStops = (places: Place[], campus: string): Place[] =>
    places
        .filter((p) => p.id !== campus)
        .sort((a, b) => a.path.length - b.path.length || a.km - b.km);

/** Local date + "HH:MM" to an RFC 3339 instant. */
export const toInstant = (day: Date, hour: number, minute: number): string =>
    new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, 0, 0).toISOString().replace('.000Z', 'Z');
