import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

import { useTheme } from '@/core/theme';

export function Chip({
    label,
    selected,
    onPress,
    icon,
}: {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    icon?: React.ReactNode;
}) {
    const { colors, radius } = useTheme();
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: !!selected }}
            style={({ pressed }) => [
                styles.chip,
                {
                    borderRadius: radius.round,
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                },
            ]}
        >
            {icon}
            <Text style={[styles.chipText, { color: selected ? colors.onPrimary : colors.text }]}>{label}</Text>
        </Pressable>
    );
}

/** Two or three mutually exclusive options in one rounded bar. */
export function Segmented<T extends string>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    const { colors, radius } = useTheme();
    return (
        <View style={[styles.segment, { backgroundColor: colors.border + '80', borderRadius: radius.md }]}>
            {options.map((o) => {
                const on = o.value === value;
                return (
                    <Pressable
                        key={o.value}
                        onPress={() => onChange(o.value)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: on }}
                        style={[
                            styles.segmentItem,
                            { borderRadius: radius.sm, backgroundColor: on ? colors.surface : 'transparent' },
                        ]}
                    >
                        <Text style={[styles.segmentText, { color: on ? colors.text : colors.textSecondary }]}>
                            {o.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export function Stepper({
    label,
    hint,
    value,
    min = 0,
    max,
    onChange,
}: {
    label: string;
    hint?: string;
    value: number;
    min?: number;
    max: number;
    onChange: (v: number) => void;
}) {
    const { colors } = useTheme();
    const btn = (enabled: boolean) => [
        styles.stepBtn,
        { borderColor: colors.border, backgroundColor: colors.surface, opacity: enabled ? 1 : 0.35 },
    ];
    return (
        <View style={styles.stepRow}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.stepLabel, { color: colors.text }]}>{label}</Text>
                {hint ? <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text> : null}
            </View>
            <Pressable
                accessibilityLabel={`Fewer ${label}`}
                disabled={value <= min}
                onPress={() => onChange(value - 1)}
                style={btn(value > min)}
            >
                <Minus size={16} color={colors.text} />
            </Pressable>
            <Text style={[styles.stepValue, { color: colors.text }]}>{value}</Text>
            <Pressable
                accessibilityLabel={`More ${label}`}
                disabled={value >= max}
                onPress={() => onChange(value + 1)}
                style={btn(value < max)}
            >
                <Plus size={16} color={colors.text} />
            </Pressable>
        </View>
    );
}

export function Button({
    title,
    onPress,
    kind = 'primary',
    busy,
    disabled,
    style,
    icon,
}: {
    title: string;
    onPress: () => void;
    kind?: 'primary' | 'secondary' | 'danger' | 'ghost';
    busy?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
}) {
    const { colors, radius } = useTheme();
    const bg = { primary: colors.primary, secondary: colors.primary + '14', danger: colors.danger + '14', ghost: 'transparent' }[kind];
    const fg = { primary: colors.onPrimary, secondary: colors.primary, danger: colors.danger, ghost: colors.primary }[kind];
    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            disabled={disabled || busy}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: bg, borderRadius: radius.md, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
                style,
            ]}
        >
            {busy ? (
                <ActivityIndicator color={fg} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
                </>
            )}
        </Pressable>
    );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
    const { colors, radius } = useTheme();
    return (
        <View
            style={[
                { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: 16 },
                style,
            ]}
        >
            {children}
        </View>
    );
}

export function SectionTitle({ children, right }: { children: string; right?: React.ReactNode }) {
    const { colors } = useTheme();
    return (
        <View style={styles.sectionRow}>
            <Text style={[styles.section, { color: colors.textSecondary }]}>{children}</Text>
            {right}
        </View>
    );
}

export function Empty({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
    const { colors } = useTheme();
    return (
        <View style={styles.empty}>
            {icon}
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>{body}</Text>
            {action}
        </View>
    );
}

export function Banner({ text, tone = 'info', onClose }: { text: string; tone?: 'info' | 'warn'; onClose?: () => void }) {
    const { colors, radius } = useTheme();
    const c = tone === 'warn' ? colors.warning : colors.primary;
    return (
        <View style={[styles.banner, { backgroundColor: c + '18', borderColor: c + '40', borderRadius: radius.md }]}>
            <Text style={[styles.bannerText, { color: colors.text }]}>{text}</Text>
            {onClose ? (
                <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Dismiss">
                    <Text style={{ color: c, fontWeight: '700' }}>OK</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: '600' },
    segment: { flexDirection: 'row', padding: 3 },
    segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
    segmentText: { fontSize: 14, fontWeight: '600' },
    stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    stepLabel: { fontSize: 15, fontWeight: '600' },
    hint: { fontSize: 12, marginTop: 2 },
    stepBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    stepValue: { width: 24, textAlign: 'center', fontSize: 16, fontWeight: '700' },
    button: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingHorizontal: 16 },
    buttonText: { fontSize: 15, fontWeight: '700' },
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
    section: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
    empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 8 },
    emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 4 },
    emptyBody: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
    banner: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12, borderWidth: 1 },
    bannerText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
