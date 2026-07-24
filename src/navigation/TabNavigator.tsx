import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Home, Users, UserCircle } from "lucide-react-native";

import DashboardScreen from "../screens/DashboardScreen";
import GroupListScreen from "../screens/GroupListScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

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
          backgroundColor: "rgba(17, 17, 17, 0.85)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
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
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="GroupsTab"
        component={GroupListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <UserCircle color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}
