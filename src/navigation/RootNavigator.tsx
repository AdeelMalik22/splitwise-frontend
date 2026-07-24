import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TabNavigator from "./TabNavigator";
import GroupDetailScreen from "../screens/GroupDetailScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import SettlementsScreen from "../screens/SettlementsScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  GroupList: undefined;
  GroupDetail: { groupId: number; groupName: string };
  AddExpense: { groupId: number };
  Settlements: { groupId: number };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    card: "#0B0B0B",
    text: "#FFFFFF",
    border: "#202020",
  },
};

export default function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GroupDetail"
              component={GroupDetailScreen}
              options={({ route }) => ({ title: route.params.groupName })}
            />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{ title: "Add Expense", presentation: "modal" }}
            />
            <Stack.Screen
              name="Settlements"
              component={SettlementsScreen}
              options={{ title: "Settlements" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false, presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
