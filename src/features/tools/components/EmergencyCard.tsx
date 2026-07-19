import React from 'react';
import { StyleSheet, TouchableOpacity, View,Alert ,Linking } from 'react-native';
import { ShieldAlert, Wrench, HeartPulse, PhoneCall } from 'lucide-react-native';
import { useTheme } from '@core/theme';
import { Card } from '@shared/components/Card';
import { ListItem } from '@shared/components/ListItem';
import { makecall, openLink } from "@/utils/linking";
import { LINKS } from '@/constants/links';


export const EmergencyCard = () => {
    const theme = useTheme();
    const { colors, radius } = theme;
    const styles = getStyles(theme);

    return (
        <Card variant="surface" style={{ padding: 0 }}>
            <View style={styles.rowWrapper}>
                <ListItem
                    leadingIcon={
                        <View style={[styles.iconContainer, { backgroundColor: colors.danger || "#FFEBEB" }]}>
                            <ShieldAlert size={22} color={"#fffbfc"} />
                        </View>
                    }
                    title="Emergency"
                    subtitle="Security & immediate assistance"
                    onPress={() => makecall("07923592000")}
                    showChevron={false}
                    showDivider={true}
                    trailingElement={<TouchableOpacity
                            style={styles.callButton}
                            onPress={() => makecall("07923952000")}
                            activeOpacity={0.7}
                        >
                            leadingIcon={
                                <View style={[styles.iconContainer, { backgroundColor: "#FFEBEB" }]}>
                                    <PhoneCall size={22} color={colors.danger} />
                                </View>
                             }    
                       </TouchableOpacity>
                    }
                />
            </View>

            <View style={styles.rowWrapper}>
                <ListItem
                    leadingIcon={
                        <View style={[styles.iconContainer, { backgroundColor: colors.warning || "#ffffff" }]}>
                            <Wrench size={22} color={"#f5f5f5"}/>
                        </View>
                    }
                    title="Maintenance"
                    subtitle="Click for maintenance appointment"
                    onPress={() => openLink(LINKS.maintenance)}
                    showDivider={true}
                />
            </View>

            <View style={styles.rowWrapper}>
                <ListItem
                    leadingIcon={
                        <View style={[styles.iconContainer, { backgroundColor: colors.success || "#ffffff" }]}>
                            <HeartPulse size={22} color={"#ffffff"} />
                        </View>
                    }
                    title="Medical Booking "
                    subtitle="Click for medical appointment"
                    onPress={() => openLink(LINKS.medical)}
                    showDivider={false}
                />
            </View>
        </Card>
    );
};

const getStyles = ({ colors, radius }: any) => StyleSheet.create({
    rowWrapper: {
        height: 78,
        justifyContent: "center",
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: radius.round || 23,
        justifyContent: "center",
        alignItems: "center",
    },
    callButton: {
        width: 36,
        height: 36,
        borderRadius: radius.round || 18,
        backgroundColor: colors.primaryLight || "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 4,
    }
});