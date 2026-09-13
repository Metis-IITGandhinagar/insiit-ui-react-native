import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@core/theme';

interface CalendarPickerProps {
    /** Current value as `YYYY-MM-DD`, or '' when unset. */
    value: string;
    onChange: (value: string) => void;
    /** Days before this are not selectable. Omit to allow any date. */
    minDate?: Date;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (value: number) => String(value).padStart(2, '0');

/** `YYYY-MM-DD` for a local date — not toISOString(), which shifts across UTC. */
export const toDateString = (date: Date): string =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Parses `YYYY-MM-DD` as a LOCAL date. `new Date("2026-09-13")` would parse as UTC. */
export const parseDateString = (value: string): Date | null => {
    const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value.trim());
    if (!match) return null;

    const [, year, month, day] = match;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return isNaN(parsed.getTime()) ? null : parsed;
};

/** Midnight local, so day comparisons ignore the time of day. */
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * A month-grid date picker built from plain Views.
 *
 * Deliberately dependency-free: a native picker module can't ship over the air to
 * binaries already installed from the store, which is why the previous one was
 * reverted (see e5a3461). This renders identically on both platforms and travels in
 * a JS-only update.
 *
 * Emits the same `YYYY-MM-DD` strings the text field used, so eventService's parsing
 * is untouched.
 */
const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange, minDate }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const selected = useMemo(() => parseDateString(value), [value]);

    // The month on screen. Starts on the selected date's month, or today's.
    const [view, setView] = useState(() => {
        const base = selected ?? new Date();
        return { year: base.getFullYear(), month: base.getMonth() };
    });

    const minimum = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);

    const cells = useMemo(() => {
        const firstWeekday = new Date(view.year, view.month, 1).getDay();
        // Day 0 of the next month is the last day of this one.
        const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

        const leading: (number | null)[] = Array(firstWeekday).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...leading, ...days];
    }, [view]);

    const shiftMonth = (delta: number) => {
        setView((current) => {
            const next = new Date(current.year, current.month + delta, 1);
            return { year: next.getFullYear(), month: next.getMonth() };
        });
    };

    const todayString = toDateString(new Date());

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => shiftMonth(-1)}
                    hitSlop={10}
                    style={styles.navButton}
                    accessibilityLabel="Previous month"
                >
                    <ChevronLeft size={20} color={theme.colors.text} />
                </Pressable>

                <Text style={styles.monthLabel}>
                    {MONTHS[view.month]} {view.year}
                </Text>

                <Pressable
                    onPress={() => shiftMonth(1)}
                    hitSlop={10}
                    style={styles.navButton}
                    accessibilityLabel="Next month"
                >
                    <ChevronRight size={20} color={theme.colors.text} />
                </Pressable>
            </View>

            <View style={styles.grid}>
                {WEEKDAYS.map((day, index) => (
                    <View key={`weekday-${index}`} style={styles.cell}>
                        <Text style={styles.weekday}>{day}</Text>
                    </View>
                ))}

                {cells.map((day, index) => {
                    if (day === null) {
                        return <View key={`blank-${index}`} style={styles.cell} />;
                    }

                    const dateString = `${view.year}-${pad(view.month + 1)}-${pad(day)}`;
                    const isSelected = value === dateString;
                    const isToday = todayString === dateString;
                    const disabled =
                        !!minimum && new Date(view.year, view.month, day).getTime() < minimum.getTime();

                    return (
                        <View key={dateString} style={styles.cell}>
                            <Pressable
                                disabled={disabled}
                                onPress={() => onChange(dateString)}
                                style={[
                                    styles.day,
                                    isSelected && styles.daySelected,
                                    isToday && !isSelected && styles.dayToday,
                                ]}
                                accessibilityRole="button"
                                accessibilityState={{ selected: isSelected, disabled }}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        isSelected && styles.dayTextSelected,
                                        disabled && styles.dayTextDisabled,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default CalendarPicker;

const getStyles = ({ colors, radius, spacing }: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            padding: spacing.sm,
            marginBottom: 16,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.sm,
            paddingBottom: spacing.sm,
        },
        navButton: {
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
        },
        monthLabel: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        // Exactly a seventh of the row, so the columns line up with the weekday labels.
        cell: {
            width: `${100 / 7}%`,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 2,
        },
        weekday: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.textSecondary,
            paddingBottom: 4,
        },
        day: {
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
        },
        daySelected: {
            backgroundColor: colors.primary,
        },
        dayToday: {
            borderWidth: 1,
            borderColor: colors.primary,
        },
        dayText: {
            fontSize: 15,
            fontWeight: '500',
            color: colors.text,
        },
        dayTextSelected: {
            color: '#FFFFFF',
            fontWeight: '700',
        },
        dayTextDisabled: {
            color: colors.textSecondary,
            opacity: 0.35,
        },
    });
