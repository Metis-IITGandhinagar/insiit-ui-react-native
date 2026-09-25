// src/features/notifications/screens/NotificationsScreen.tsx
import React, { useState, useMemo } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    Bell,
    BellOff,
    BellRing,
    Calendar,
    CheckCheck,
    ChevronRight,
    Megaphone,
    Trash2,
} from 'lucide-react-native';

import { useTheme } from '@/core/theme';
import { Card } from '@/shared/components/Card';
import ScreenHeader from '@/shared/components/ScreenHeader';
import { useNotifications } from '../hooks/useNotifications';
import { AppNotification, NotificationType } from '../services/notificationTypes';
import { formatRelativeDate } from '@/features/lostfound/utils/formatDate';

type FilterTab = 'all' | 'event' | 'announcement';

export default function NotificationsScreen() {
    const theme = useTheme();
    const { colors, spacing, radius, typography } = theme;
    const styles = getStyles(theme);
    const navigation = useNavigation<any>();

    const {
        notifications,
        loading,
        refreshing,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll,
        refresh,
    } = useNotifications();

    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'all') return notifications;
        if (activeTab === 'event') {
            return notifications.filter((n) => n.type === 'event' || n.type === 'reminder');
        }
        if (activeTab === 'announcement') {
            return notifications.filter((n) => n.type === 'announcement');
        }
        return notifications;
    }, [notifications, activeTab]);

    const handlePressItem = (notification: AppNotification) => {
        markAsRead(notification.id);
        if (notification.targetRoute === 'Events') {
            navigation.navigate('MainTabs', { tab: 'Events' });
        } else if (notification.targetRoute === 'Announcements') {
            navigation.navigate('Announcements');
        }
    };

    const handleClearAll = () => {
        if (notifications.length === 0) return;
        Alert.alert(
            'Clear Notifications',
            'Are you sure you want to clear all notifications?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear All', style: 'destructive', onPress: clearAll },
            ]
        );
    };

    const renderIcon = (type: NotificationType) => {
        switch (type) {
            case 'reminder':
                return <BellRing size={20} color={colors.primary} strokeWidth={2} />;
            case 'announcement':
                return <Megaphone size={20} color={colors.warning || '#F59E0B'} strokeWidth={2} />;
            case 'event':
            default:
                return <Calendar size={20} color={colors.primary} strokeWidth={2} />;
        }
    };

    const renderTypeLabel = (type: NotificationType) => {
        switch (type) {
            case 'reminder':
                return 'Event Reminder';
            case 'announcement':
                return 'Announcement';
            case 'event':
            default:
                return 'Campus Event';
        }
    };

    return (
        <>
            <StatusBar
                barStyle={theme.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <View style={styles.headerWrapper}>
                    <ScreenHeader
                        title="Notifications"
                        subtitle={
                            unreadCount > 0
                                ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`
                                : 'Events and announcements'
                        }
                        right={
                            notifications.length > 0 ? (
                                <View style={styles.headerActions}>
                                    {unreadCount > 0 && (
                                        <TouchableOpacity
                                            style={styles.actionIconButton}
                                            onPress={markAllAsRead}
                                            accessibilityLabel="Mark all as read"
                                        >
                                            <CheckCheck size={20} color={colors.primary} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.actionIconButton}
                                        onPress={handleClearAll}
                                        accessibilityLabel="Clear all notifications"
                                    >
                                        <Trash2 size={20} color={colors.danger} />
                                    </TouchableOpacity>
                                </View>
                            ) : null
                        }
                    />
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'all' && styles.tabButtonActive,
                        ]}
                        onPress={() => setActiveTab('all')}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'all' && styles.tabTextActive,
                            ]}
                        >
                            All ({notifications.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'event' && styles.tabButtonActive,
                        ]}
                        onPress={() => setActiveTab('event')}
                        activeOpacity={0.7}
                    >
                        <Calendar
                            size={14}
                            color={activeTab === 'event' ? colors.onPrimary : colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'event' && styles.tabTextActive,
                            ]}
                        >
                            Events
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'announcement' && styles.tabButtonActive,
                        ]}
                        onPress={() => setActiveTab('announcement')}
                        activeOpacity={0.7}
                    >
                        <Megaphone
                            size={14}
                            color={activeTab === 'announcement' ? colors.onPrimary : colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'announcement' && styles.tabTextActive,
                            ]}
                        >
                            Announcements
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Notification List */}
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    {loading && notifications.length === 0 ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : filteredNotifications.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Card style={styles.emptyCard}>
                                <View style={styles.emptyIconCircle}>
                                    <BellOff size={36} color={colors.textSecondary} />
                                </View>
                                <Text style={styles.emptyTitle}>No notifications</Text>
                                <Text style={styles.emptySubtitle}>
                                    {activeTab === 'event'
                                        ? 'No event updates or reminders right now.'
                                        : activeTab === 'announcement'
                                        ? 'No new announcements posted yet.'
                                        : 'You are all caught up on events and announcements!'}
                                </Text>
                            </Card>
                        </View>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <TouchableOpacity
                                key={notification.id}
                                activeOpacity={0.85}
                                onPress={() => handlePressItem(notification)}
                            >
                                <Card
                                    style={[
                                        styles.notificationCard,
                                        !notification.read && styles.unreadCard,
                                    ]}
                                >
                                    <View style={styles.cardRow}>
                                        <View
                                            style={[
                                                styles.iconContainer,
                                                {
                                                    backgroundColor:
                                                        notification.type === 'reminder'
                                                            ? colors.primaryLight
                                                            : notification.type === 'announcement'
                                                            ? colors.warning + '18'
                                                            : colors.primaryLight,
                                                },
                                            ]}
                                        >
                                            {renderIcon(notification.type)}
                                        </View>

                                        <View style={styles.cardContent}>
                                            <View style={styles.cardHeaderRow}>
                                                <View style={styles.badgeWrapper}>
                                                    <Text style={styles.typeBadge}>
                                                        {renderTypeLabel(notification.type)}
                                                    </Text>
                                                    {!notification.read && (
                                                        <View style={styles.unreadDot} />
                                                    )}
                                                </View>
                                                <Text style={styles.timeText}>
                                                    {formatRelativeDate(notification.timestamp)}
                                                </Text>
                                            </View>

                                            <Text
                                                style={[
                                                    styles.title,
                                                    !notification.read && styles.unreadTitle,
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {notification.title}
                                            </Text>

                                            <Text
                                                style={styles.bodyText}
                                                numberOfLines={3}
                                            >
                                                {notification.body}
                                            </Text>

                                            <View style={styles.cardFooter}>
                                                <Text style={styles.actionHint}>
                                                    Tap to view {notification.targetRoute}
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.dismissButton}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        dismissNotification(notification.id);
                                                    }}
                                                    accessibilityLabel="Dismiss"
                                                >
                                                    <Trash2 size={16} color={colors.textSecondary} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const getStyles = ({ colors, spacing, radius, typography }: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerWrapper: {
            paddingHorizontal: spacing.lg,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        actionIconButton: {
            width: 38,
            height: 38,
            borderRadius: radius.round,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        tabsContainer: {
            flexDirection: 'row',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            gap: spacing.sm,
        },
        tabButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: spacing.md,
            paddingVertical: 7,
            borderRadius: radius.round,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
        },
        tabButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        tabText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        tabTextActive: {
            color: colors.onPrimary,
        },
        content: {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: 100,
            gap: spacing.md,
        },
        centered: {
            paddingVertical: spacing.xxl,
            alignItems: 'center',
        },
        emptyContainer: {
            paddingVertical: spacing.xl,
        },
        emptyCard: {
            alignItems: 'center',
            paddingVertical: spacing.xxl,
            paddingHorizontal: spacing.lg,
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
        },
        emptyIconCircle: {
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        emptyTitle: {
            ...typography.h3,
            color: colors.text,
            marginBottom: spacing.xs,
        },
        emptySubtitle: {
            ...typography.body,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
        },
        notificationCard: {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
        },
        unreadCard: {
            borderColor: colors.primary,
            backgroundColor: colors.surface,
        },
        cardRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: spacing.md,
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: radius.md,
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            marginTop: 2,
        },
        cardContent: {
            flex: 1,
        },
        cardHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        badgeWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        typeBadge: {
            fontSize: 11,
            fontWeight: '700',
            color: colors.primary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
        },
        timeText: {
            fontSize: 11,
            color: colors.textSecondary,
        },
        title: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
            lineHeight: 20,
        },
        unreadTitle: {
            fontWeight: '700',
        },
        bodyText: {
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 18,
            marginBottom: spacing.sm,
        },
        cardFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 4,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        actionHint: {
            fontSize: 11,
            color: colors.primary,
            fontWeight: '600',
        },
        dismissButton: {
            padding: 4,
        },
    });
