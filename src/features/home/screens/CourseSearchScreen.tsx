import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Check, Plus } from 'lucide-react-native';
import { useTheme } from '@/core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { timetableService } from '../services/timetableService';

export default function CourseSearchScreen() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { colors, spacing } = theme;
    const styles = getStyles(theme);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [allCourses, setAllCourses] = useState<string[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());

    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch saved selections
                const saved = await AsyncStorage.getItem('@selected_courses');
                if (saved) {
                    setSelectedCourses(new Set(JSON.parse(saved)));
                }

                // Fetch all available courses
                const courses = await timetableService.getAllCourses();
                setAllCourses(courses);
            } catch (error) {
                Alert.alert("Error", "Could not load courses from the server.");
            } finally {
                setLoading(false);
            }
        };
        initializeData();
    }, []);

    const filteredCourses = useMemo(() => {
        if (!search.trim()) return allCourses;
        return allCourses.filter(course =>
            course.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, allCourses]);

    const toggleCourse = (courseCode: string) => {
        setSelectedCourses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(courseCode)) {
                newSet.delete(courseCode);
            } else {
                newSet.add(courseCode);
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        const coursesArray = Array.from(selectedCourses);
        await AsyncStorage.setItem('@selected_courses', JSON.stringify(coursesArray));
        navigation.goBack(); // Go back to Home
    };

    const renderItem = ({ item }: { item: string }) => {
        const isSelected = selectedCourses.has(item);

        return (
            <TouchableOpacity
                style={[styles.courseRow, isSelected && styles.courseRowSelected]}
                onPress={() => toggleCourse(item)}
                activeOpacity={0.7}
            >
                <Text style={[styles.courseCode, isSelected && { color: colors.primary }]}>
                    {item}
                </Text>
                <View style={[styles.checkbox, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                    {isSelected ? <Check size={14} color="#FFF" /> : <Plus size={14} color="#999" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search courses (e.g., ES 101)..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    autoFocus
                />
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveText}>Done</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.selectedCountBar}>
                <Text style={styles.selectedCountText}>
                    {selectedCourses.size} {selectedCourses.size === 1 ? 'course' : 'courses'} selected
                </Text>
            </View>

            <FlatList
                data={filteredCourses}
                keyExtractor={(item, index) => `${item}-${index}`}
                contentContainerStyle={styles.listContent}
                initialNumToRender={20}
                windowSize={5}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} />
                        ) : (
                            <Text style={styles.emptyText}>No courses match "{search}"</Text>
                        )}
                    </View>
                }
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

const getStyles = ({ colors, spacing, radius, typography }: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', padding: spacing.md, alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: '#EEE'
    },
    searchInput: {
        flex: 1, backgroundColor: '#F5F5F5', padding: 12, borderRadius: 12,
        fontSize: 16, color: colors.text
    },
    saveButton: {
        paddingLeft: spacing.md,
        paddingVertical: 8
    },
    saveText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
    selectedCountBar: { backgroundColor: colors.primary + '15', padding: 10, alignItems: 'center' },
    selectedCountText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
    listContent: { padding: spacing.md, paddingBottom: 100 },
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyText: { color: '#999', fontSize: 16 },
    courseRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
    },
    courseRowSelected: { backgroundColor: colors.primary + '05', paddingHorizontal: 8, borderRadius: 8 },
    courseCode: { ...typography.h3, color: colors.text },
    checkbox: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#DDD',
        justifyContent: 'center', alignItems: 'center'
    }
});