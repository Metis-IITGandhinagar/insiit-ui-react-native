import React from "react";
import { View } from "react-native";

import { Card, Divider, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

import { Meal, MealStatus } from "../types";
import { MealItem } from "./MealItem";
import {
  MealStatusChip,
} from "./MealStatusChip";

type Props = {
  meal: Meal;
  status: MealStatus;
};

export function MealCard({
  meal,
  status,
}: Props) {
  const { spacing } = useTheme();

  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="subtitle">
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

        <MealStatusChip status={status} />
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
        {meal.items.length === 0 ? (
          <Text
            variant="caption"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {meal.items.length} items
          </Text>
        ) : (
          meal.items.map((item) => (
            <MealItem
              key={item}
              item={item}
            />
        )))}
      </View>
    </Card>
  );
}