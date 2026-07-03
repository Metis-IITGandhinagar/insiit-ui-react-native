import React from "react";
import { View } from "react-native";

import { Card, Divider, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

type Props = {
  route?: string;
  departure?: string;
  arrival?: string;
  minutes?: number;
};

export function BusPreviewCard({
  route = "No upcoming buses",
  departure,
  arrival,
  minutes,
}: Props) {
  const { spacing } = useTheme();

  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <Text variant="subtitle">
        Next Bus
      </Text>

      <View
        style={{
          marginTop: spacing.md,
        }}
      >
        <Text variant="title">
          {route}
        </Text>

        {minutes !== undefined && (
          <Text
            variant="body"
            style={{
              marginTop: spacing.sm,
            }}
          >
            {minutes} min remaining
          </Text>
        )}

        {(departure || arrival) && (
          <>
            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <Divider />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text variant="caption">
                  Departure
                </Text>

                <Text
                  variant="body"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {departure ?? "--"}
                </Text>
              </View>

              <View>
                <Text variant="caption">
                  Arrival
                </Text>

                <Text
                  variant="body"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {arrival ?? "--"}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </Card>
  );
}