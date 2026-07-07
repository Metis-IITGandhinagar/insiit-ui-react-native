import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type BusType = "EECO" | "29" | "56";

const BusTypeTabs = () => {
    const [selected, setSelected] = useState<BusType>("EECO");

    const tabs: BusType[] = ["EECO", "29", "56"];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const active = selected === tab;

                return (
                    <TouchableOpacity
                        key={tab}
                        activeOpacity={0.85}
                        style={[
                            styles.tab,
                            active && styles.activeTab,
                        ]}
                        onPress={() => setSelected(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                active && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BusTypeTabs;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        padding: 6,

        flexDirection: "row",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    tab: {
        flex: 1,

        height: 48,

        borderRadius: 14,

        justifyContent: "center",
        alignItems: "center",
    },

    activeTab: {
        backgroundColor: "#2563EB",
    },

    tabText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#64748B",
    },

    activeTabText: {
        color: "#FFFFFF",
    },
});