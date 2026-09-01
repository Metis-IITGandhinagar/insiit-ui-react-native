import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = (process.env.EXPO_PUBLIC_TIMETABLE_API_URL as string).replace(/\/+$/, '');

const COURSES_CACHE_KEY = '@timetable_courses_cache';
const CACHE_TIME_KEY = '@timetable_courses_cache_time';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;
const SCHEDULE_CACHE_KEY = '@timetable_schedule_cache';

export interface TimetableSession {
    name: string;
    course: string;
    day: string;
    time: string;
    venue: string;
    type: string;
}

const DAY_KEY_TO_LETTER: Record<string, string> = {
    sunday: 'Su',
    monday: 'M',
    tuesday: 'T',
    wednesday: 'W',
    thursday: 'Th',
    friday: 'F',
    saturday: 'Sa',
};

interface RawGridEntry {
    class: string;
    time: string;
}
type RawTimetableGrid = Record<string, RawGridEntry[]>;

function parseClassString(raw: string): { course: string; name: string; type: string; venue: string } {
    const parts = raw.split(',').map(p => p.trim());

    if (parts.length >= 4) {
        return {
            course: parts[0],
            name: parts[1],
            type: parts[2],
            venue: parts.slice(3).join(', '),
        };
    }

    return {
        course: raw,
        name: '',
        type: 'Class',
        venue: '',
    };
}

function transformGridToSessions(grid: RawTimetableGrid): TimetableSession[] {
    const sessions: TimetableSession[] = [];

    for (const dayKey of Object.keys(grid)) {
        const letter = DAY_KEY_TO_LETTER[dayKey.toLowerCase()];
        if (!letter) continue;

        for (const entry of grid[dayKey] ?? []) {
            const { course, name, type, venue } = parseClassString(entry.class);
            sessions.push({
                course,
                name,
                day: letter,
                time: entry.time,
                venue,
                type,
            });
        }
    }

    return sessions;
}

export const timetableService = {
    getAllCourses: async (forceRefresh = false): Promise<string[]> => {
        try {
            if (!forceRefresh) {
                const cachedData = await AsyncStorage.getItem(COURSES_CACHE_KEY);
                const cacheTime = await AsyncStorage.getItem(CACHE_TIME_KEY);

                if (cachedData && cacheTime) {
                    const now = new Date().getTime();
                    if (now - parseInt(cacheTime, 10) < CACHE_EXPIRY_MS) {
                        return JSON.parse(cachedData);
                    }
                }
            }

            const response = await fetch(`${BASE_URL}/courses`);
            if (!response.ok) throw new Error('Failed to fetch courses');

            const rawData = await response.json();
            const courseList = rawData.courses.map((course: any) => {
                if (course.name) {
                    return `${course.code} - ${course.name}`;
                }
                return course.code || course.title || String(course);
            });

            AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(courseList));
            AsyncStorage.setItem(CACHE_TIME_KEY, new Date().getTime().toString());

            return courseList;
        } catch (error) {
            console.error('Error fetching courses:', error);

            const cachedData = await AsyncStorage.getItem(COURSES_CACHE_KEY);
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            throw error;
        }
    },

    getLocalTimetable: async (): Promise<TimetableSession[]> => {
        try {
            const cached = await AsyncStorage.getItem(SCHEDULE_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.error('Failed to read local schedule:', error);
            return [];
        }
    },

    getTimetable: async (courses: string[]): Promise<TimetableSession[]> => {
        if (courses.length === 0) {
            await AsyncStorage.removeItem(SCHEDULE_CACHE_KEY);
            return [];
        }

        try {
            const response = await fetch(`${BASE_URL}/timetable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courses }),
            });

            if (!response.ok) throw new Error('Failed to fetch timetable');

            const rawData: RawTimetableGrid = await response.json();
            const sessions = transformGridToSessions(rawData);

            AsyncStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(sessions));

            return sessions;
        } catch (error) {
            console.error('Network failed, falling back to cached schedule:', error);
            return await timetableService.getLocalTimetable();
        }
    },
};