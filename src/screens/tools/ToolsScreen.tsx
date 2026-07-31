// src/screens/tools/ToolsScreen.tsx
import React from "react";

import Screen from "@/components/Screen";
import ToolsHeader from "./components/ToolsHeader";
import EmergencyCard from "./components/EmergencyCard";
import ToolSection from "./components/ToolSection";
import QuickActions from "./components/QuickActions";

const ToolsScreen = () => {
    return (
        <Screen>
            <ToolsHeader />

            <EmergencyCard />

            <QuickActions />

            <ToolSection />
        </Screen>
    );
};

export default ToolsScreen;
