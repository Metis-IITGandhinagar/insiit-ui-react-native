// src/features/admin/screens/AdminDashboardScreen.tsx
import React, { useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar, Megaphone, Utensils, Users, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { EmptyPermission } from '../components/EmptyPermission';
import { AdminStackParamList } from '@/core/navigation/AdminNavigator';

type AdminDashboardNavigationProp = StackNavigationProp<AdminStackParamList, 'AdminDashboard'>;

export const AdminDashboardScreen: React.FC = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const navigation = useNavigation<AdminDashboardNavigationProp>();

    const {
        permissions,
        isLoading,
        error,
        refetch,
        canManageEvents,
        canManageAnnouncements,
        canManageMessMenu,
        hasAnyAdminPermission,
    } = useAdminPermissions();

    const handleNavigateEvents = useCallback(() => {
        navigation.navigate('EventManagement');
    }, [navigation]);

    const handleNavigateAnnouncements = useCallback(() => {
        navigation.navigate('AnnouncementManagement');
    }, [navigation]);

    const handleNavigateMessMenu = useCallback(() => {
        navigation.navigate('MessMenuManagement');
    }, [navigation]);

    const handleNavigateUsers = useCallback(() => {
        navigation.navigate('UserManagement');
    }, [navigation]);

    const sections = useMemo(() => {
        const items = [];

        if (canManageEvents) {
            items.push({
                id: 'events',
                title: 'Events Management',
                description: 'Create, update, and moderate campus events',
                icon: <Calendar size={22} color={colors.primary} />,
                onPress: handleNavigateEvents,
            });
        }

        if (canManageAnnouncements) {
            items.push({
                id: 'announcements',
                title: 'Announcements',
                description: 'Broadcast notices and official updates',
                icon: <Megaphone size={22} color={colors.primary} />,
                onPress: handleNavigateAnnouncements,
            });
        }

        if (canManageMessMenu) {
            items.push({
                id: 'mess',
                title: 'Mess Menu',
                description: 'Update daily breakfast, lunch, and dinner schedules',
                icon: <Utensils size={22} color={colors.primary} />,
                onPress: handleNavigateMessMenu,
            });
        }

        if (permissions?.get_admin) {
            items.push({
                id: 'users',
                title: 'User Permissions',
                description: 'Assign and revoke administrative privileges',
                icon: <Users size={22} color={colors.primary} />,
                onPress: handleNavigateUsers,
            });
        }

        return items;
    }, [
        canManageEvents,
        canManageAnnouncements,
        canManageMessMenu,
        colors.primary,
        handleNavigateEvents,
        handleNavigateAnnouncements,
        handleNavigateMessMenu,
        handleNavigateUsers,
        permissions?.get_admin,
    ]);

    if (isLoading && !sections.length) {
        return (
            <View style={styles.centeredView}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error && !sections.length) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>
                    Failed to Load
                </Text>
                <Text style={styles.errorSubtitle}>
                    {error.message}
                </Text>
                <TouchableOpacity
                    onPress={refetch}
                    activeOpacity={0.8}
                    style={styles.retryBtn}
                >
                    <RefreshCw size={16} color="#FFFFFF" />
                    <Text style={styles.retryText}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!hasAnyAdminPermission) {
        return <EmptyPermission />;
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentScroll}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.headerSubtitle}>
                Manage IIT Gandhinagar portal operations
            </Text>

            <View style={styles.sectionList}>
                {sections.map((section) => (
                    <AdminSectionCard
                        key={section.id}
                        title={section.title}
                        description={section.description}
                        icon={section.icon}
                        onPress={section.onPress}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const getStyles = ({ colors, radius, spacing, typography }: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentScroll: {
        flexGrow: 1,
        padding: spacing.lg,
    },
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        padding: spacing.xl,
    },
    errorTitle: {
        color: colors.text,
        fontSize: typography.h3?.fontSize || 20,
        fontWeight: typography.h3?.fontWeight || '700',
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    errorSubtitle: {
        color: colors.textSecondary,
        fontSize: typography.h2?.fontSize || 14,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius?.sm || spacing.sm,
        gap: 8,
    },
    retryText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: typography.button?.fontWeight || '600',
    },
    headerTitle: {
        letterSpacing: -0.5,
        color: colors.text,
        fontSize: typography.h2?.fontSize || 24,
        fontWeight: typography.h2?.fontWeight || 'bold',
    },
    headerSubtitle: {
        letterSpacing: -0.2,
        color: colors.textSecondary,
        fontSize: typography.h3?.fontSize || 16,
        marginBottom: spacing.xl,
    },
    sectionList: {
        width: '100%',
    },
});