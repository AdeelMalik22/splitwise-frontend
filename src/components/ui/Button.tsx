import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        isDisabled && { opacity: 0.5 },
        pressed && !isDisabled && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#000" : "#fff"} />
      ) : (
        <Text style={[styles.textBase, styles[`text_${variant}`], styles[`text_${size}`]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 24 },
  lg: { paddingVertical: 16, paddingHorizontal: 32 },
  
  primary: { backgroundColor: "#FFFFFF" },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: colors.error },

  textBase: { fontWeight: "600" },
  text_primary: { color: "#000000" },
  text_secondary: { color: "#FFFFFF", fontWeight: "500" },
  text_ghost: { color: "#FFFFFF", fontWeight: "500" },
  text_danger: { color: "#FFFFFF" },

  text_sm: { fontSize: 14 },
  text_md: { fontSize: 16 },
  text_lg: { fontSize: 18 },
});
