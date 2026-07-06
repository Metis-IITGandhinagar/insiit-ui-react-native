import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
    House,
    Bus,
    Ellipsis,
    LucideIcon,
    Search,
    Wrench,
} from "lucide-react-native";

import {
    useNavigation,
    useRoute,
    NavigationProp,
} from "@react-navigation/native";
import { colors } from "@/theme";

const PRIMARY = colors.primary;
const INACTIVE = colors.inactive;

type RootStackParamList = {
    Home: undefined;
    Search: undefined;
    Tools: undefined;
    Bus: undefined;
    More: undefined;
};

type NavItemProps = {
    icon: LucideIcon;
    active: boolean;
    onPress: () => void;
};

const FloatingNavbar = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();

    const currentScreen = route.name;

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <NavItem
                    icon={House}
                    active={currentScreen === "Home"}
                    onPress={() => navigation.navigate("Home")}
                />

                <NavItem
                    icon={Search}
                    active={currentScreen === "Search"}
                    onPress={() => navigation.navigate("Search")}
                />

                <NavItem
                    icon={Wrench}
                    active={currentScreen === "Tools"}
                    onPress={() => navigation.navigate("Tools")}
                />

                <NavItem
                    icon={Bus}
                    active={currentScreen === "Bus"}
                    onPress={() => navigation.navigate("Bus")}
                />

                <NavItem
                    icon={Ellipsis}
                    active={currentScreen === "More"}
                    onPress={() => navigation.navigate("More")}
                />
            </View>
        </View>
    );
};

const NavItem = ({
    icon: Icon,
    active,
    onPress,
}: NavItemProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.item, active && styles.activeItem]}
        >
            <Icon
                size={24}
                color={active ? colors.surface : INACTIVE}
                strokeWidth={2.2}
            />
        </TouchableOpacity>
    );
};

export default FloatingNavbar;

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 70,
    },

    container: {
        height: 72,
        backgroundColor: colors.surface,
        borderRadius: 36,

        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 10,
        },

        elevation: 12,
    },

    item: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
    },

    activeItem: {
        backgroundColor: PRIMARY,
    },
});