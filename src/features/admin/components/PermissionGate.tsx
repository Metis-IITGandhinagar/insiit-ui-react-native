import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@core/theme';
import { ShieldAlert } from 'lucide-react-native';

export interface PermissionGateProps {
    hasPermission: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    hasPermission,
    children,
    fallback,
    style,
}) => {
    const { colors, radius, spacing, typography } = useTheme();

    if (hasPermission) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

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
                        backgroundColor: colors.danger ? `${colors.danger}15` : 'rgba(239, 68, 68, 0.1)',
                        borderRadius: radius.xl ?? 9999,
                        padding: spacing.lg,
                        marginBottom: spacing.md,
                    },
                ]}
            >
                <ShieldAlert
                    size={48}
                    color={colors.danger || '#EF4444'}
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
                Access Denied
            </Text>

            <Text
                style={[
                    styles.message,
                    {
                        color: colors.textSecondary,
                        fontSize: typography.h2?.fontSize || 14,
                        textAlign: 'center',
                    },
                ]}
            >
                You do not have the required administrative permissions to access or view this module.
            </Text>
        </View>
    );
};

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
        maxWidth: 300,
    },
});