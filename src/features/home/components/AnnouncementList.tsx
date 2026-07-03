import React from "react";
import { View } from "react-native";

import { Card, Divider, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

export interface Announcement {
    id: string;
    title: string;
    date: string;
}

type Props = {
    announcements?: Announcement[];
};

export function AnnouncementList({
    announcements = [],
}: Props) {
    const { spacing } = useTheme();

    return (
        <Card
            style={{
                marginTop: spacing.lg,
            }}
        >
            <Text variant="subtitle">
                Announcements
            </Text>

            {announcements.length === 0 ? (
                <Text
                    variant="caption"
                    style={{
                        marginTop: spacing.md,
                    }}
                >
                    No announcements.
                </Text>
            ) : (
                announcements.map((announcement, index) => (
                    <View key={announcement.id}>
                        <View
                            style={{
                                marginTop: spacing.md,
                            }}
                        >
                            <Text variant="body">
                                {announcement.title}
                            </Text>

                            <Text
                                variant="caption"
                                style={{
                                    marginTop: spacing.sm,
                                }}
                            >
                                {announcement.date}
                            </Text>
                        </View>

                        {index !== announcements.length - 1 && (
                            <View
                                style={{
                                    marginTop: spacing.md,
                                }}
                            >
                                <Divider />
                            </View>
                        )}
                    </View>
                ))
            )}
        </Card>
    );
}