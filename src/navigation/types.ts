import {
    BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import {
    NativeStackNavigationProp,
} from "@react-navigation/native-stack";

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

export type RootStackParamList = {
    MainTabs: undefined;

    Mess: undefined;
    Events: undefined;
    QR: undefined;
    Timetable: undefined;
};

export type MainTabNavigationProp =
    BottomTabNavigationProp<MainTabParamList>;

export type RootNavigationProp =
    NativeStackNavigationProp<RootStackParamList>;