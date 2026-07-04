import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";

import {
  EmptyState,
  LoadingView,
  ScreenContainer,
} from "../../components/layout";
import { Text } from "../../components/ui";
import {
  DaySelector,
  MealCard,
} from "./components";
import { useTheme } from "../../theme";
import { useMess } from "./hooks/useMess";
import { getMealStatus } from "./mealStatus";
import { getCurrentDayIndex } from "./utils/day";

export function MessScreen() {
  const { spacing } = useTheme();

  const { data, isLoading } = useMess();

  const [selectedDay, setSelectedDay] = useState(
    getCurrentDayIndex()
  );

  const week = data?.week ?? [];

  const day = useMemo(
    () => week[selectedDay],
    [week, selectedDay]
  );
  console.log(week.map((d) => d.day));
  if (isLoading) {
    return <LoadingView />;
  }

  if (!day) {
    return (
      <ScreenContainer>
        <EmptyState
          title="No menu available"
          description="The mess menu has not been published yet."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
      >
        <Text variant="title">
          Mess
        </Text>

        <Text
          variant="caption"
          style={{
            marginTop: spacing.xs,
          }}
        >
          {day.day}
        </Text>
          
        {/* Day selector */}
        <DaySelector
          days={week.map((day) => day.day)}
          selectedIndex={selectedDay}
          onSelect={setSelectedDay}
        />
        {/* Meal cards */}
        {day.meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            status={getMealStatus(meal)}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}