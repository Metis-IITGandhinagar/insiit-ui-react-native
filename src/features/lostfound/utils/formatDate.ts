
export function formatRelativeDate(timestampSeconds: number): string {
    const now = Date.now();
    const then = timestampSeconds * 1000;
    const diffMs = now - then;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    const date = new Date(then);
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}


export function daysUntilArchive(addedOnTimestampSeconds: number): number {
    const ARCHIVE_AFTER_DAYS = 30;
    const addedOn = addedOnTimestampSeconds * 1000;
    const archiveAt = addedOn + ARCHIVE_AFTER_DAYS * 24 * 60 * 60 * 1000;
    const remainingMs = archiveAt - Date.now();
    return Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
}