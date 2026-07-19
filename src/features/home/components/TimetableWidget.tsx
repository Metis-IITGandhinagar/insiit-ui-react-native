import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin, Clock, Plus, Calendar, CheckCircle2 } from 'lucide-react-native';

import WeeklyTimetableSheet from './WeeklyTimetableSheet';

import { useTheme } from '@/core/theme';
import { timetableService, TimetableSession } from '../services/timetableService';

export default function TimetableWidget() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const [isSheetOpen, setSheetOpen] = useState(false);
    const [schedule, setSchedule] = useState<TimetableSession[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const loadTimetable = async () => {
                const localSchedule = await timetableService.getLocalTimetable();
                if (isActive) {
                    if (localSchedule.length > 0) setSchedule(localSchedule);
                    setLoading(false); 
                }

                const savedCoursesStr = await AsyncStorage.getItem('@selected_courses');
                if (savedCoursesStr) {
                    const courses = JSON.parse(savedCoursesStr);
                    if (courses.length > 0) {
                        const freshSchedule = await timetableService.getTimetable(courses);
                        if (isActive) {
                            setSchedule(freshSchedule);
                            setLoading(false);
                        }
                    } else {
                        if (isActive) {
                            setSchedule([]);
                            setLoading(false);
                        }
                    }
                } else {
                    if (isActive) setLoading(false);
                }
            };

            loadTimetable();
            return () => { isActive = false; };
        }, [])
    );

    const nextClass = useMemo(() => {
        if (!schedule || schedule.length === 0) return null;

        const now = new Date();
        const currentDayIndex = now.getDay(); 
        const dayMap = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
        const todayStr = dayMap[currentDayIndex];

        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const todaysClasses = Array.isArray(schedule) ? schedule.filter(s => s.day === todayStr) : [];

        const upcomingClasses = todaysClasses.map(c => {
            const timeParts = c.time.replace(/\s/g, '').split(/[-–—]/);
            if (timeParts.length < 2) return null;

            const parseTime = (t: string) => {
                let [h, m] = t.split(':').map(Number);
                if (h < 7) h += 12;
                return h * 60 + (m || 0);
            };

            const startMins = parseTime(timeParts[0]);
            const endMins = parseTime(timeParts[1]);

            return { ...c, startMins, endMins };
        }).filter(c => c !== null && c.endMins > currentMinutes); 

        if (upcomingClasses.length === 0) return null; 

        upcomingClasses.sort((a, b) => a!.startMins - b!.startMins);
        const next = upcomingClasses[0];

        let startsInStr = '';
        const diff = next!.startMins - currentMinutes;

        if (diff <= 0) {
            startsInStr = 'Ongoing now';
        } else if (diff < 60) {
            startsInStr = `in ${diff} mins`;
        } else {
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            startsInStr = `in ${h}h ${m > 0 ? `${m}m` : ''}`;
        }

        return {
            courseCode: next!.course,
            courseName: next!.course, 
            time: next!.time,
            venue: next!.venue,
            startsIn: startsInStr,
            type: next!.type
        };
    }, [schedule]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Timetable</Text>

                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => navigation.navigate('CourseSearch' as never)}
                >
                    <Plus size={16} color={colors.primary} />
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
            </View>

            {loading && schedule.length === 0 ? (
                <View style={styles.emptyCard}>
                    <ActivityIndicator color={colors.primary} size="small" />
                </View>
            ) : schedule.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No courses added.</Text>
                    <Text style={styles.emptySubText}>Tap 'Add' to setup your schedule.</Text>
                </View>
            ) : nextClass ? (
                <View style={styles.nextClassContainer}>
                    <View style={styles.nextClassHeader}>
                        <Text style={styles.upNextLabel}>UP NEXT • {nextClass.startsIn}</Text>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{nextClass.type}</Text>
                        </View>
                    </View>

                    <Text style={styles.courseCode}>{nextClass.courseCode}</Text>
                    <Text style={styles.courseName}>{nextClass.courseName}</Text>

                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Clock size={14} color={colors.textSecondary || '#666'} />
                            <Text style={styles.detailText}>{nextClass.time}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <MapPin size={14} color={colors.textSecondary || '#666'} />
                            <Text style={styles.detailText}>{nextClass.venue}</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyCard}>
                    <CheckCircle2 size={28} color={colors.primary} style={{ marginBottom: 8 }} />
                    <Text style={styles.emptyText}>All done for today!</Text>
                    <Text style={styles.emptySubText}>Enjoy the rest of your day.</Text>
                </View>
            )}

            {/* Weekly View Button */}
            <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setSheetOpen(true)}
            >
                <Calendar size={18} color={colors.primary} />
                <Text style={styles.viewButtonText}>View Weekly Timetable</Text>
            </TouchableOpacity>

            <WeeklyTimetableSheet
                visible={isSheetOpen}
                onClose={() => setSheetOpen(false)}
                schedule={schedule}
            />
        </View>
    );
}

const getStyles = ({ colors, spacing, radius, typography }: any) => StyleSheet.create({
    container: {
        paddingVertical: spacing.xs,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h2,
        color: colors.text,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: radius.round,
        gap: 4,
    },
    addBtnText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    nextClassContainer: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: spacing.md,
    },
    nextClassHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    upNextLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    typeBadge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#555',
        textTransform: 'uppercase',
    },
    courseCode: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 2,
    },
    courseName: {
        fontSize: 15,
        color: colors.textSecondary || '#666',
        marginBottom: 16,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textSecondary || '#666',
    },
    emptyCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: radius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    emptySubText: {
        fontSize: 14,
        color: colors.textSecondary || '#888',
    },
    viewButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingVertical: 14,
        borderRadius: radius.lg,
    },
    viewButtonText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 15,
    }
});