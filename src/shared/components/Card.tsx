// src/shared/components/Card.tsx
import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@core/theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'surface' | 'primary';
    style?: StyleProp<ViewStyle>; 
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'surface',
    style
}) => {
    const theme = useTheme();
    const styles = getStyles(theme, variant);

    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const getStyles = ({ colors, radius, shadows, spacing }: any, variant: 'surface' | 'primary') =>
    StyleSheet.create({
        card: {
            borderRadius: radius.lg, 
            padding: spacing.lg,     
            backgroundColor: variant === 'primary' ? colors.primary : colors.surface || 'white',
            ...(variant === 'surface' && shadows ? shadows.md : {}),
            overflow: 'hidden',
        },
    });