import React from "react";
import { View } from "react-native";

import { Card, Divider, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

export interface HomeEvent {
  id: string;
  title: string;
  venue: string;
  time: string;
}

type Props = {
  events?: HomeEvent[];
};

export function UpcomingEventsCard({
  events = [],
}: Props) {
  const { spacing } = useTheme();

  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <Text variant="subtitle">
        Upcoming Events
      </Text>

      {events.length === 0 ? (
        <Text
          variant="caption"
          style={{
            marginTop: spacing.md,
          }}
        >
          No upcoming events.
        </Text>
      ) : (
        events.map((event, index) => (
          <View key={event.id}>
            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Text variant="body">
                {event.title}
              </Text>

              <Text
                variant="caption"
                style={{
                  marginTop: spacing.sm,
                }}
              >
                📍 {event.venue}
              </Text>

              <Text
                variant="caption"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                🕒 {event.time}
              </Text>
            </View>

            {index !== events.length - 1 && (
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
