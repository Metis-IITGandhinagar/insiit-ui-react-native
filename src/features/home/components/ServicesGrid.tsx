import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Store, Search, Share2, ShoppingCart } from 'lucide-react-native';

import { useTheme } from '@/core/theme';

interface ServiceItem {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    route?: string;
    badge?: string;
}

const ServicesGrid = () => {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);

    const services: ServiceItem[] = [
        {
            id: 'outlets',
            title: 'Outlets',
            subtitle: 'Campus food spots',
            icon: <Store size={28} color="#fff" strokeWidth={1.5} />,
            color: '#3B82F6',
            bgColor: '#3B82F6',
            route: 'Outlets',
        },
        {
            id: 'lost-found',
            title: 'Lost & Found',
            subtitle: 'Report or search items',
            icon: <Search size={28} color="#fff" strokeWidth={1.5} />,
            color: '#F59E0B',
            bgColor: '#F59E0B',
            route: 'LostFound',
        },
        {
            id: 'cabshare',
            title: 'Cabshare',
            subtitle: 'Ride with campus mates',
            icon: <Share2 size={28} color="#fff" strokeWidth={1.5} />,
            color: '#8B5CF6',
            bgColor: '#8B5CF6',
            route: 'Cabshare',
            badge: 'Soon',
        },
        {
            id: 'buy-sell',
            title: 'Buy & Sell',
            subtitle: 'Like campus OLX',
            icon: <ShoppingCart size={28} color="#fff" strokeWidth={1.5} />,
            color: '#EF4444',
            bgColor: '#EF4444',
            route: 'BuySell',
        },
    ];

    const handlePress = (route?: string) => {
        if (route) {
            navigation.navigate(route);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Services</Text>
            <View style={styles.grid}>
                {services.map((service) => (
                    <TouchableOpacity
                        key={service.id}
                        style={styles.serviceCard}
                        activeOpacity={0.85}
                        onPress={() => handlePress(service.route)}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: service.bgColor },
                            ]}
                        >
                            {service.icon}
                        </View>
                        {service.badge && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{service.badge}</Text>
                            </View>
                        )}
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ServicesGrid;

const getStyles = ({ colors, spacing, radius, typography }: any) =>
    StyleSheet.create({
        container: {
            marginTop: spacing.lg,
        },
        title: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.text,
            marginBottom: spacing.md,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between', 
        },
        serviceCard: {
            width: '48%',
            marginBottom: spacing.md, 
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        iconContainer: {
            width: 60,
            height: 60,
            borderRadius: radius.lg,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        badge: {
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#3B82F6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        badgeText: {
            color: 'white',
            fontSize: 11,
            fontWeight: '700',
            textTransform: 'uppercase',
        },
        serviceTitle: {
            fontSize: 12,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 2,
            textAlign: 'center',
        },
        serviceSubtitle: {
            fontSize: 10,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 14,
        },
    });