import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight, User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/core/navigation/types";
import { Card } from "@/shared/components/Card";
import { useTheme } from "@/core/theme";
import { useAuth } from "@/core/auth/useAuth";

const ProfileHeroCard = () => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();

    const displayName = user?.displayName || "IITGN Student";
    const email = user?.email || "";
    const photoURL = user?.photoURL;

    return (
        <Card style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.profileButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Profile")}
            >
                {photoURL ? (
                    <Image source={{ uri: photoURL }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <User size={24} color={colors.textSecondary} />
                    </View>
                )}

                <View style={styles.textContainer}>
                    <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
                    {!!email && (
                        <Text style={styles.email} numberOfLines={1}>{email}</Text>
                    )}
                </View>

                <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </Card>
    );
};

export default ProfileHeroCard;

const getStyles = ({ colors, spacing }: any) => StyleSheet.create({
    cardContainer: {
        marginBottom: spacing.md,
        padding: 0,
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    avatarPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },
    email: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
