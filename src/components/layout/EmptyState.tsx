import React from "react";

import { ScreenContainer } from "./ScreenContainer";
import { Text } from "../ui";

type Props = {
    title: string;
    description?: string;
};

export function EmptyState({
    title,
    description,
}: Props) {
    return (
        <ScreenContainer>
            <Text variant="title">{title}</Text>

            {description ? (
                <Text variant="body">
                    {description}
                </Text>
            ) : null}
        </ScreenContainer>
    );
}