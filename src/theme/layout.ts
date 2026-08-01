// theme/layout.ts
// Centralized layout constants so every screen, card and list item share the
// same top spacing and margins. Change here, and it changes everywhere.
const layout = {
    // Screen scroll/content container
    screenPaddingX: 20,       // horizontal gutter (== spacing.lg)
    screenPaddingTop: 16,     // gap below the safe-area inset (== spacing.md)
    screenPaddingBottom: 120, // clearance for the floating tab bar
    contentGap: 20,           // vertical gap between stacked sections/cards

    // Cards & list items
    cardRadius: 24,           // == radius.xl
    cardPadding: 20,          // == spacing.lg
    listItemGap: 20,          // gap between list items (== contentGap)
};

export default layout;
