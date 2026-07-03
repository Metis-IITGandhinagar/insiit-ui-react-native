import { useTheme } from "@/theme/useTheme";
import React from "react";
import { Image } from "react-native";

type Props = {
    uri?: string;
    size?: number;
};

export function Avatar({
    uri,
    size = 48,
}: Props) {
    const { radius } = useTheme();

    return (
        <Image
            source={{
                uri:
                    uri ??
                    "https://ui-avatars.com/api/?name=User",
            }}
            style={{
                width: size,
                height: size,
                borderRadius: radius.full,
            }}
        />
    );
}