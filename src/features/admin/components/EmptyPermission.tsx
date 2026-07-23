import React, { memo } from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@core/theme';
import { ShieldOff } from 'lucide-react-native';

export interface EmptyPermissionProps {
    title?: string;
    message?: string;
    style?: StyleProp<ViewStyle>;
}

export const EmptyPermission: React.FC<EmptyPermissionProps> = memo(({
    title = 'No Permissions Assigned',
    message = 'Your account currently lacks administrative rights for any module. Please contact the administrator if you believe this is an error.',
    style,
}) => {
    const { colors, radius, spacing, typography } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    padding: spacing.xl,
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: colors.surface,
                        borderRadius: radius.xl ?? 9999,
                        padding: spacing.lg,
                        marginBottom: spacing.md,
                    },
                ]}
            >
                <ShieldOff
                    size={48}
                    color={colors.textSecondary || '#65676B'}
                />
            </View>

            <Text
                style={[
                    styles.title,
                    {
                        color: colors.text,
                        fontSize: typography.h3?.fontSize || 20,
                        fontWeight: typography.h3?.fontWeight || '700',
                        marginBottom: spacing.xs,
                    },
                ]}
            >
                {title}
            </Text>

            <Text
                style={[
                    styles.message,
                    {
                        color: colors.textSecondary,
                        fontSize: typography.h2?.fontSize || 14,
                    },
                ]}
            >
                {message}
            </Text>
        </View>
    );
});

EmptyPermission.displayName = 'EmptyPermission';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        maxWidth: 320,
    },
});