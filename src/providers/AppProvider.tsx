import { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProvider({ children }: PropsWithChildren) {
    return (
            <SafeAreaProvider>
                <QueryProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                </QueryProvider>
            </SafeAreaProvider>
    );
}