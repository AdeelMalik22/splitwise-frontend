import React from "react";
import { View, ViewProps, Pressable, PressableProps, StyleSheet } from "react-native";
import { colors } from "../../theme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ style, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

interface PressableCardProps extends PressableProps {
  style?: any;
  children: React.ReactNode;
}

export function PressableCard({ style, children, ...props }: PressableCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 20,
  },
});
