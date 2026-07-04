import React from "react";

import { Text } from "../../../components/ui";
import { useTheme } from "../../../theme";

type Props = {
    item: string;
};

export function MealItem({
    item,
}: Props) {
    const { spacing } = useTheme();

    return (
        <Text
            variant="body"
            style={{
                marginTop: spacing.sm,
            }}
        >
            • {item}
        </Text>
    );
}