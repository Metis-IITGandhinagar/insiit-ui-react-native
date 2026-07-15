import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { useAuth } from '../hooks/useAuth';

import AdminDashboard from '../screens/more/AdminDashboard';
import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/home/HomeScreen";
import SearchScreen from "@/screens/search/SearchScreen";
import BusScreen from "@/screens/bus/BusScreen";
import ToolsScreen from "@/screens/tools/ToolsScreen";
import MoreScreen from "@/screens/more/MoreScreen";
import RepresentativesScreen from "@/screens/more/RepresentativesScreen";
import TeamScreen from "@/screens/more/TeamScreen";
import VersionScreen from "@/screens/more/VersionNerdScreen";
import VersionNerdScreen from "@/screens/more/VersionNerdScreen";
  

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <View style={{flex:1 , justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large" color="#A52A2A"/>
            </View>
        )
    }
   
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                }}
            >

                {user ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Search" component={SearchScreen} />
                        <Stack.Screen name="Bus" component={BusScreen} />
                        <Stack.Screen name="Tools" component={ToolsScreen} />
                        <Stack.Screen name="More" component={MoreScreen} />
                        <Stack.Screen
                            name="AdminDashboard"
                            component={AdminDashboard}
                           />
                        <Stack.Screen
                            name="Representatives"
                            component={RepresentativesScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="TeamINSIIT"
                            component={TeamScreen}
                            options={{ animation: "slide_from_right" }}
                        />
                        <Stack.Screen
                            name="VersionNerd"
                            component={VersionNerdScreen}
                            options={{ animation: "fade" }} 
                        />
                    </>
                ) : (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                    />
                )}

            </Stack.Navigator>
        </NavigationContainer>
    );
}