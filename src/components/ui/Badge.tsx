import React from 'react';
import { View, Text } from 'react-native';

export default function Badge({ children }: { children?: React.ReactNode }) {
  return (
    <View>
      <Text>{children}</Text>
    </View>
  );
}
