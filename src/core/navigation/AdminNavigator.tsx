import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@core/theme';

import { AdminDashboardScreen } from '@/features/admin/screens/AdminDashboardScreen';
import { EventManagementScreen } from '@/features/admin/screens/EventManagementScreen';
import { AnnouncementManagementScreen } from '@/features/admin/screens/AnnouncementManagementScreen';
import { MessMenuManagementScreen } from '@/features/admin/screens/MessMenuManagementScreen';
import { UserManagementScreen } from '@/features/admin/screens/UserManagementScreen';

export type AdminStackParamList = {
    AdminDashboard: undefined;
    EventManagement: undefined;
    AnnouncementManagement: undefined;
    MessMenuManagement: undefined;
    UserManagement: undefined;
};

const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator: React.FC = () => {
    const { colors, typography } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="AdminDashboard"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.surface,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border || 'rgba(0, 0, 0, 0.08)',
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontSize: typography.h3?.fontSize || 18,
                    fontWeight: typography.h3?.fontWeight || '700',
                    color: colors.text,
                },
                 headerBackTitleStyle: false,
                cardStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{
                    title: 'Admin Console',
                }}
            />
            <Stack.Screen
                name="EventManagement"
                component={EventManagementScreen}
                options={{
                    title: 'Event Management',
                }}
            />
            <Stack.Screen
                name="AnnouncementManagement"
                component={AnnouncementManagementScreen}
                options={{
                    title: 'Announcements',
                }}
            />
            <Stack.Screen
                name="MessMenuManagement"
                component={MessMenuManagementScreen}
                options={{
                    title: 'Mess Schedule',
                }}
            />
            <Stack.Screen
                name="UserManagement"
                component={UserManagementScreen}
                options={{
                    title: 'User Permissions',
                }}
            />
        </Stack.Navigator>
    );
};