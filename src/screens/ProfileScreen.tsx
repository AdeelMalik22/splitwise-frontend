import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyProfile } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/models";
import { colors, spacing } from "../theme";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfileScreen() {
  const { userId, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (userId == null) return;
      getMyProfile(userId).then(setProfile).catch(() => {});
    }, [userId])
  );

  return (
    <View style={styles.container}>
      {profile ? (
        <View style={styles.card}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.detail}>@{profile.username}</Text>
          <Text style={styles.detail}>{profile.email}</Text>
        </View>
      ) : null}
      <PrimaryButton title="Log Out" variant="outline" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 20, fontWeight: "700", color: colors.text },
  detail: { fontSize: 14, color: colors.subtext, marginTop: spacing.xs },
});
