import { parseBackendInstant } from "@/core/api/backendTime";

export function formatRelativeDate(timestamp: string | number): string {
    const then = parseBackendInstant(timestamp)?.getTime();
    if (then === undefined) return "";

    const diffMs = Date.now() - then;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(then).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function daysUntilArchive(addedOnTimestamp: string | number, maxDays = 7): number {
    const addedOn = parseBackendInstant(addedOnTimestamp)?.getTime();
    if (addedOn === undefined) return 0;

    const archiveAt = addedOn + maxDays * 24 * 60 * 60 * 1000;
    return Math.max(0, Math.ceil((archiveAt - Date.now()) / (1000 * 60 * 60 * 24)));
}