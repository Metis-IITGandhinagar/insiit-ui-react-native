import React from "react";
import { Pressable } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/theme/useTheme";

type Props = {
  icon: LucideIcon;
  onPress: () => void;
  size?: number;
};

export function IconButton({
  icon: Icon,
  onPress,
  size = 22,
}: Props) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: spacing.sm,
        borderRadius: radius.full,
      }}
    >
      <Icon
        color={colors.text}
        size={size}
      />
    </Pressable>
  );
}