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
    const { colors, spacing, typography } = useTheme();
    const navigation = useNavigation<AdminDashboardNavigationProp>();

    const {
        isLoading,
        error,
        refetch,
        canManageEvents,
        canManageAnnouncements,
        canManageMessMenu,
        canManageUsers,
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

        if (canManageUsers) {
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
        canManageUsers,
        colors.primary,
        handleNavigateEvents,
        handleNavigateAnnouncements,
        handleNavigateMessMenu,
        handleNavigateUsers,
    ]);

    if (isLoading && !sections.length) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error && !sections.length) {
        return (
            <View style={[styles.centered, { backgroundColor: colors.background, padding: spacing.xl }]}>
                <Text
                    style={[
                        styles.errorTitle,
                        {
                            color: colors.text,
                            fontSize: typography.h3?.fontSize || 20,
                            fontWeight: typography.h3?.fontWeight || '700',
                            marginBottom: spacing.xs,
                        },
                    ]}
                >
                    Failed to Load
                </Text>
                <Text
                    style={[
                        styles.errorText,
                        {
                            color: colors.textSecondary,
                            fontSize: typography.h2?.fontSize || 14,
                            marginBottom: spacing.lg,
                        },
                    ]}
                >
                    {error.message}
                </Text>
                <TouchableOpacity
                    onPress={refetch}
                    activeOpacity={0.8}
                    style={[
                        styles.retryButton,
                        {
                            backgroundColor: colors.primary,
                            paddingHorizontal: spacing.lg,
                            paddingVertical: spacing.md,
                            borderRadius: spacing.sm,
                        },
                    ]}
                >
                    <RefreshCw size={16} color={colors.primary || '#FFFFFF'} style={styles.retryIcon} />
                    <Text
                        style={[
                            styles.retryText,
                            {
                                color: colors.primary || '#FFFFFF',
                                fontWeight: typography.button?.fontWeight || '600',
                            },
                        ]}
                    >
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
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={[styles.contentContainer, { padding: spacing.lg }]}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
            showsVerticalScrollIndicator={false}
        >
            <Text
                style={[
                    styles.headerTitle,
                    {
                        color: colors.text,
                        fontSize: typography.h1?.fontSize || 28,
                        fontWeight: typography.h1?.fontWeight || '800',
                        marginBottom: spacing.xs,
                    },
                ]}
            >
                Admin Console
            </Text>
            <Text
                style={[
                    styles.headerSubtitle,
                    {
                        color: colors.textSecondary,
                        fontSize: typography.h1?.fontSize || 16,
                        marginBottom: spacing.xl,
                    },
                ]}
            >
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        letterSpacing: -0.2,
    },
    sectionList: {
        width: '100%',
    },
    errorTitle: {
        textAlign: 'center',
    },
    errorText: {
        textAlign: 'center',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryIcon: {
        marginRight: 8,
    },
    retryText: {
        fontSize: 14,
    },
});