// src/navigation/tabs.ts
import { House, Bus, Ellipsis, Search, Wrench } from "lucide-react-native";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react-native";

import HomeScreen from "@/features/home/screens/HomeScreen";
import SearchScreen from "@/screens/search/SearchScreen";
import ToolsScreen from "@/features/tools/screens/ToolsScreen";
import BusScreen from "@/screens/bus/BusScreen";
import MoreScreen from "@/screens/more/MoreScreen";

export type TabName = "Home" | "Search" | "Tools" | "Bus" | "More";

export interface TabDefinition {
    name: TabName;
    icon: LucideIcon;
    component: ComponentType<any>;
}

export const TABS: TabDefinition[] = [
    { name: "Home", icon: House, component: HomeScreen },
    { name: "Search", icon: Search, component: SearchScreen },
    { name: "Tools", icon: Wrench, component: ToolsScreen },
    { name: "Bus", icon: Bus, component: BusScreen },
    { name: "More", icon: Ellipsis, component: MoreScreen },
];

export const TAB_NAMES: TabName[] = TABS.map((t) => t.name);
export const TAB_COUNT = TABS.length;

export const tabIndex = (name: TabName): number => TAB_NAMES.indexOf(name);