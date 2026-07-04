import React from "react";
import { View } from "react-native";

import { Card, Divider, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";
import { Pressable } from "react-native";
import { Meal } from "../../mess/types";
import { MealStatusChip } from "../../mess/components";
import { getMealStatus } from "../../mess/mealStatus";

type Props = {
  meal?: Meal;
  onPress?: () => void;
};

export function MessPreviewCard({
  meal,
  onPress,
}: Props) {
  const { spacing } = useTheme();

  return (
    <Pressable onPress={onPress}>
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <Text variant="subtitle">
        Next Meal
      </Text>

      {!meal ? (
        <Text
          variant="caption"
          style={{
            marginTop: spacing.md,
          }}
        >
          Menu not available.
        </Text>
      ) : (
        <>
          <View
            style={{
              marginTop: spacing.md,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="body">
                {meal.type}
              </Text>

              <Text
                variant="caption"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                {meal.startTime} – {meal.endTime}
              </Text>
            </View>

            <MealStatusChip
              status={getMealStatus(meal)}
            />
          </View>

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Divider />
          </View>

          <View
            style={{
              marginTop: spacing.sm,
            }}
          >
            {meal.items.slice(0, 4).map((item) => (
              <Text
                key={item}
                variant="body"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                • {item}
              </Text>
            ))}

            {meal.items.length > 4 && (
              <Text
                variant="caption"
                style={{
                  marginTop: spacing.sm,
                }}
              >
                +{meal.items.length - 4} more items
              </Text>
            )}
          </View>
        </>
      )}
    </Card>
    </Pressable>
  );
}