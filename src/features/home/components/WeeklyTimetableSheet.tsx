import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

        for (const day of Object.keys(groups)) {
            groups[day].sort((a, b) => a.time.localeCompare(b.time));
        }

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
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
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
                                                        <Text style={styles.sessionCourse}>{session.course}</Text>
                                                        <Text style={styles.sessionMeta}>
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
    closeButton: { padding: 4 },
    closeText: { color: colors.danger || 'red', fontWeight: '600' },
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
    sessionInfo: { flex: 1 },
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