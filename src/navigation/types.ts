import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type AuthStackParamList = {
    Login: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Outlets: undefined;
    Buses: undefined;
    Services: undefined;
    More: undefined;
};

export type MainTabNavigationProp =
    BottomTabNavigationProp<MainTabParamList>;