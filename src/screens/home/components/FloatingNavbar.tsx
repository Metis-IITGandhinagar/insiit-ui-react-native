import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
    House,
    Users,
    Bus,
    Ellipsis,
    LucideIcon,
    Search,
    Wrench,
} from "lucide-react-native";

const PRIMARY = "#2563EB";
const INACTIVE = "#94A3B8";

const FloatingNavbar = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <NavItem icon={House} active />
                <NavItem icon={Search} />
                <NavItem icon={Wrench} />
                <NavItem icon={Bus} />
                <NavItem icon={Ellipsis} />
            </View>
        </View>
    );
};

type NavItemProps = {
    icon: LucideIcon;
    active?: boolean;
};

const NavItem = ({ icon: Icon, active = false }: NavItemProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.item, active && styles.activeItem]}
        >
            <Icon
                size={24}
                color={active ? "#FFFFFF" : INACTIVE}
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
        backgroundColor: "#FFFFFF",
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