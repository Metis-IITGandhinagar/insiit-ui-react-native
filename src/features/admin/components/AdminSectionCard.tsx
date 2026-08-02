import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@shared/components/Card';
import { ListItem } from '@shared/components/ListItem';
import { useTheme } from '@core/theme';

export interface AdminSectionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onPress: () => void;
    badgeCount?: number;
}

export const AdminSectionCard: React.FC<AdminSectionCardProps> = memo(({
    title,
    description,
    icon,
    onPress,
    badgeCount,
}) => {
    const { colors, radius, spacing, typography } = useTheme();

    const renderBadge = () => {
        if (badgeCount === undefined || badgeCount <= 0) return null;

        return (
            <View
                style={[
                    styles.badge,
                    {
                        backgroundColor: colors.primary,
                        borderRadius: radius.xl ?? 9999,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs / 2,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.badgeText,
                        {
                            color: colors.primary || colors.surface,
                            fontSize: typography.caption?.fontSize || 12,
                            fontWeight: typography.caption?.fontWeight || '600',
                        },
                    ]}
                >
                    {badgeCount > 99 ? '99+' : badgeCount}
                </Text>
            </View>
        );
    };

    return (
        <Card variant="surface" style={styles.cardOverride}>
            <ListItem
                leadingIcon={icon}
                title={title}
                subtitle={description}
                onPress={onPress}
                showChevron={true}
                showDivider={false}
                trailingElement={renderBadge()}
            />
        </Card>
    );
});

AdminSectionCard.displayName = 'AdminSectionCard';

const styles = StyleSheet.create({
    cardOverride: {
        padding: 0,
        marginVertical: 6,
    },
    badge: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
    },
    badgeText: {
        textAlign: 'center',
    },
});