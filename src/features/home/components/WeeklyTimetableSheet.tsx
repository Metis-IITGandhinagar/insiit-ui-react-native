import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X } from 'lucide-react-native'; 
import { useTheme } from '@/core/theme';
import { TimetableSession } from '../services/timetableService';

interface Props {
    visible: boolean;
    onClose: () => void;
    schedule: TimetableSession[];
}

const DAY_ORDER = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
const DAY_LABELS: Record<string, string> = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    Th: 'Thursday',
    F: 'Friday',
    Sa: 'Saturday',
    Su: 'Sunday',
};

export default function WeeklyTimetableSheet({ visible, onClose, schedule }: Props) {
    const theme = useTheme();
    const styles = getStyles(theme);

    const groupedByDay = useMemo(() => {
        const groups: Record<string, TimetableSession[]> = {};
        for (const day of DAY_ORDER) groups[day] = [];

        for (const session of schedule ?? []) {
            if (!groups[session.day]) groups[session.day] = [];
            groups[session.day].push(session);
        }

        const parseTime = (time: string) => {
    const start = time.split('-')[0].trim();

    const match = start.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return Number.MAX_SAFE_INTEGER;

    let [, hour, minute, period] = match;

    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    period = period.toUpperCase();

    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;

    return h * 60 + m;
};

        return groups;
    }, [schedule]);

    const isFridayFree = (groupedByDay['F'] ?? []).length === 0;

    const getEmptyDayMessage = (day: string) => {
        if (day === 'F' && isFridayFree) return 'Long weekend! 🎉';
        return 'You can chill today 😌';
    };

    const hasAnyClasses = (schedule ?? []).length > 0;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Weekly Schedule</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                            activeOpacity={0.7}
                        >
                            <X size={22} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {!hasAnyClasses ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No courses added yet.</Text>
                            </View>
                        ) : (
                            DAY_ORDER.map(day => {
                                const sessions = groupedByDay[day];

                                return (
                                    <View key={day} style={styles.dayBlock}>
                                        <Text style={styles.dayLabel}>{DAY_LABELS[day]}</Text>

                                        {sessions.length === 0 ? (
                                            <View style={styles.freeDayRow}>
                                                <Text style={styles.freeDayText}>
                                                    {getEmptyDayMessage(day)}
                                                </Text>
                                            </View>
                                        ) : (
                                            sessions.map((session, idx) => (
                                                <View key={idx} style={styles.sessionRow}>
                                                    <Text style={styles.sessionTime}>{session.time}</Text>
                                                    <View style={styles.sessionInfo}>
                                                        <Text
                                                            style={styles.sessionCourse}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {session.course}{session.name ? ` - ${session.name}` : ''}
                                                        </Text>
                                                        <Text
                                                            style={styles.sessionMeta}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {session.type}{session.venue ? ` • ${session.venue}` : ''}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const getStyles = ({ colors, spacing, typography }: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    sheet: {
        backgroundColor: colors.background,
        height: '85%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg
    },
    title: { ...typography.h2, color: colors.text },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { flex: 1 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
    emptyText: { color: '#999', fontSize: 16 },
    dayBlock: { marginBottom: spacing.lg },
    dayLabel: {
        ...typography.h3,
        color: colors.primary,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
    },
    sessionRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sessionTime: {
        width: 90,
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary || '#666',
    },
    
    sessionInfo: { flex: 1, minWidth: 0 },

    sessionCourse: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
    },
    sessionMeta: {
        fontSize: 13,
        color: colors.textSecondary || '#888',
        marginTop: 2,
    },
    freeDayRow: {
        paddingVertical: 12,
    },
    freeDayText: {
        fontSize: 14,
        color: colors.textSecondary || '#999',
        fontStyle: 'italic',
    },
});