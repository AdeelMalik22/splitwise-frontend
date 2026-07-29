import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Home, Users, UserCircle } from "lucide-react-native";

import DashboardScreen from "../screens/DashboardScreen";
import GroupListScreen from "../screens/GroupListScreen";
import ProfileScreen from "../screens/ProfileScreen";

type TabParamList = {
  DashboardTab: undefined;
  GroupsTab: undefined;
  ProfileTab: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          elevation: 0,
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          borderWidth: 1,
          borderColor: "#E5E5E5",
          borderRadius: 32,
          height: 64,
          paddingBottom: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={80}
            style={StyleSheet.absoluteFillObject}
            className="rounded-[32px] overflow-hidden"
          />
        ),
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginBottom: 5 },
        tabBarActiveTintColor: "#111111",
        tabBarInactiveTintColor: "#A3ADA6",
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen as any}
        options={{
          tabBarLabel: "Overview", tabBarIcon: ({ color }) => <Home color={color} size={21} />,
        }}
      />
      <Tab.Screen
        name="GroupsTab"
        component={GroupListScreen as any}
        options={{
          tabBarLabel: "Groups", tabBarIcon: ({ color }) => <Users color={color} size={21} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile", tabBarIcon: ({ color }) => <UserCircle color={color} size={21} />,
        }}
      />
    </Tab.Navigator>
  );
}
