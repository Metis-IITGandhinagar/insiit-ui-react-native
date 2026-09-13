import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';

interface TimePickerProps {
    /** Current value as `H:MM AM/PM`, or '' when unset. */
    value: string;
    onChange: (value: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const MERIDIEMS = ['AM', 'PM'] as const;

const ROW_HEIGHT = 40;
const VISIBLE_ROWS = 4;

const pad = (value: number) => String(value).padStart(2, '0');

interface TimeParts {
    hour: number;
    minute: number;
    meridiem: 'AM' | 'PM';
}

/** Parses `H:MM AM/PM`. Matches the format eventService expects on the way back out. */
export const parseTimeString = (value: string): TimeParts | null => {
    const match = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/.exec(value.trim());
    if (!match) return null;

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 1 || hour > 12 || minute > 59) return null;

    return { hour, minute, meridiem: match[3].toUpperCase() as 'AM' | 'PM' };
};

export const formatTimeParts = ({ hour, minute, meridiem }: TimeParts): string =>
    `${hour}:${pad(minute)} ${meridiem}`;

/** Nearest sensible default when nothing is set yet: the next whole hour. */
const defaultParts = (): TimeParts => {
    const next = new Date();
    next.setHours(next.getHours() + 1, 0, 0, 0);

    const hours24 = next.getHours();
    return {
        hour: hours24 % 12 === 0 ? 12 : hours24 % 12,
        minute: 0,
        meridiem: hours24 >= 12 ? 'PM' : 'AM',
    };
};

interface ColumnProps<T> {
    options: readonly T[];
    selectedIndex: number;
    label: (option: T) => string;
    onSelect: (option: T) => void;
}

/**
 * One scrollable column of tappable options.
 *
 * Tap-to-select rather than a snapping wheel: a wheel has to infer the choice from a
 * scroll offset, which is easy to get subtly wrong across platforms, and there's no
 * native module here to fall back on. Tapping is unambiguous.
 */
function Column<T>({ options, selectedIndex, label, onSelect }: ColumnProps<T>) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const scrollRef = useRef<ScrollView>(null);

    // Bring the current choice into view when the panel opens or the value changes
    // from outside — otherwise "9:45 PM" could open scrolled to the top of the list.
    useEffect(() => {
        if (selectedIndex < 0) return;

        const offset = Math.max(0, (selectedIndex - Math.floor(VISIBLE_ROWS / 2)) * ROW_HEIGHT);
        // Defer past the first layout, or the ScrollView has nothing to scroll yet.
        const timer = setTimeout(() => scrollRef.current?.scrollTo({ y: offset, animated: false }), 0);

        return () => clearTimeout(timer);
    }, [selectedIndex]);

    return (
        <ScrollView
            ref={scrollRef}
            style={styles.column}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
        >
            {options.map((option, index) => {
                const isSelected = index === selectedIndex;

                return (
                    <Pressable
                        key={label(option)}
                        onPress={() => onSelect(option)}
                        style={[styles.row, isSelected && styles.rowSelected]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                    >
                        <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
                            {label(option)}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

/**
 * A dependency-free time picker: hour, minute and AM/PM as three tappable columns.
 *
 * Minute granularity is a full 60 rather than 5-minute steps so editing an event
 * saved at 7:37 doesn't silently round its time.
 */
const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const parts = useMemo(() => parseTimeString(value) ?? defaultParts(), [value]);

    const update = (next: Partial<TimeParts>) => {
        onChange(formatTimeParts({ ...parts, ...next }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.columns}>
                <Column
                    options={HOURS}
                    selectedIndex={HOURS.indexOf(parts.hour)}
                    label={(hour) => String(hour)}
                    onSelect={(hour) => update({ hour })}
                />

                <Text style={styles.separator}>:</Text>

                <Column
                    options={MINUTES}
                    selectedIndex={parts.minute}
                    label={(minute) => pad(minute)}
                    onSelect={(minute) => update({ minute })}
                />

                <Column
                    options={MERIDIEMS}
                    selectedIndex={MERIDIEMS.indexOf(parts.meridiem)}
                    label={(meridiem) => meridiem}
                    onSelect={(meridiem) => update({ meridiem })}
                />
            </View>

            <Text style={styles.preview}>{formatTimeParts(parts)}</Text>
        </View>
    );
};

export default TimePicker;

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
        columns: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: ROW_HEIGHT * VISIBLE_ROWS,
            gap: spacing.sm,
        },
        column: {
            flexGrow: 0,
            width: 72,
        },
        row: {
            height: ROW_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.sm ?? 8,
        },
        rowSelected: {
            backgroundColor: colors.primary,
        },
        rowText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.text,
        },
        rowTextSelected: {
            color: '#FFFFFF',
            fontWeight: '700',
        },
        separator: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.textSecondary,
        },
        preview: {
            textAlign: 'center',
            paddingTop: spacing.sm,
            fontSize: 13,
            color: colors.textSecondary,
        },
    });
