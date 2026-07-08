import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    Calendar,
    Clock3,
    MapPin,
    Users,
    Link2,
    Tag,
} from "lucide-react-native";

import {
    colors,
    radius,
    spacing,
} from "@/theme";

const Input = ({
    icon,
    placeholder,
}: {
    icon: React.ReactNode;
    placeholder: string;
}) => (
    <View style={styles.inputContainer}>
        {icon}

        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            style={styles.input}
        />
    </View>
);

const EventDetailsCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.heading}>
                Event Details
            </Text>

            <Input
                placeholder="Event Title"
                icon={
                    <Tag
                        size={18}
                        color={colors.primary}
                    />
                }
            />

            <Input
                placeholder="Organizing Club"
                icon={
                    <Users
                        size={18}
                        color={colors.primary}
                    />
                }
            />

            <Input
                placeholder="Date"
                icon={
                    <Calendar
                        size={18}
                        color={colors.primary}
                    />
                }
            />

            <Input
                placeholder="Time"
                icon={
                    <Clock3
                        size={18}
                        color={colors.primary}
                    />
                }
            />

            <Input
                placeholder="Venue"
                icon={
                    <MapPin
                        size={18}
                        color={colors.primary}
                    />
                }
            />

            <Input
                placeholder="Registration Link"
                icon={
                    <Link2
                        size={18}
                        color={colors.primary}
                    />
                }
            />
        </View>
    );
};

export default EventDetailsCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,

        borderRadius: radius.xl,

        padding: spacing.lg,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 4,
    },

    heading: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: spacing.lg,
    },

    inputContainer: {
        height: 56,

        borderWidth: 1,
        borderColor: "#E5E7EB",

        borderRadius: radius.lg,

        paddingHorizontal: spacing.md,

        flexDirection: "row",
        alignItems: "center",

        marginBottom: spacing.md,
    },

    input: {
        flex: 1,

        marginLeft: spacing.md,

        fontSize: 16,

        color: colors.text,
    },
});