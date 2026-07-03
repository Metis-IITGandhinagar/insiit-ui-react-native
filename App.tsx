import { AppProvider } from "@/providers";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  return (
    <SafeAreaProvider>
    <AppProvider>
      <RootNavigator />
    </AppProvider>
    </SafeAreaProvider>
  );
}