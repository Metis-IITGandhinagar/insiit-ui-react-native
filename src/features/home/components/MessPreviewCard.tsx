import React from "react";
import { View } from "react-native";

import { Card, Divider, Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

type Meal = {
  title: string;
  items: string[];
};

type Props = {
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
};

function MealSection({
  meal,
  isLast = false,
}: {
  meal?: Meal;
  isLast?: boolean;
}) {
  const { spacing } = useTheme();

  return (
    <>
      <View
        style={{
          marginTop: spacing.md,
        }}
      >
        <Text variant="subtitle">
          {meal?.title ?? "Unavailable"}
        </Text>

        <Text
          variant="body"
          style={{
            marginTop: spacing.sm,
          }}
        >
          {meal
            ? meal.items.join(" • ")
            : "Menu not published"}
        </Text>
      </View>

      {!isLast && (
        <View
          style={{
            marginTop: spacing.md,
          }}
        >
          <Divider />
        </View>
      )}
    </>
  );
}

export function MessPreviewCard({
  breakfast,
  lunch,
  dinner,
}: Props) {
  const { spacing } = useTheme();

  return (
    <Card
      style={{
        marginTop: spacing.lg,
      }}
    >
      <Text variant="subtitle">
        Today's Mess
      </Text>

      <MealSection meal={breakfast} />

      <MealSection meal={lunch} />

      <MealSection
        meal={dinner}
        isLast
      />
    </Card>
  );
}
