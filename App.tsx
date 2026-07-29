import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F8F4",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 500 : undefined,
    backgroundColor: "#F7F8F4",
    overflow: "hidden",
    borderLeftWidth: Platform.OS === "web" ? 1 : 0,
    borderRightWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "#E5E8DF",
  },
});
