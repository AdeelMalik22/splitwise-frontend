import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyProfile } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { User } from "../types/models";
import { Card } from "../components/ui/Card";
import { User as UserIcon, Bell, Shield, HelpCircle, LogOut } from "lucide-react-native";
import { colors } from "../theme";

export default function ProfileScreen() {
  const { userId, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (userId == null) return;
      getMyProfile(userId).then(setProfile).catch(() => {});
    }, [userId])
  );

  const getInitial = () => profile?.name ? profile.name.charAt(0).toUpperCase() : profile?.username?.charAt(0).toUpperCase() || "U";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        <Text style={styles.name}>{profile?.name || "Loading..."}</Text>
        <Text style={styles.username}>@{profile?.username}</Text>
      </View>

      <Text style={styles.sectionLabel}>Account</Text>
      <Card style={styles.card}>
        <View style={[styles.row, styles.borderBottom]}>
          <UserIcon size={20} color={colors.textSecondary} style={styles.rowIcon} />
          <View>
            <Text style={styles.rowTitle}>Email Address</Text>
            <Text style={styles.rowSubtitle}>{profile?.email || "..."}</Text>
          </View>
        </View>
        <View style={[styles.row, styles.borderBottom]}>
          <Shield size={20} color={colors.textSecondary} style={styles.rowIcon} />
          <View>
            <Text style={styles.rowTitle}>Security</Text>
            <Text style={styles.rowSubtitle}>Password, 2FA</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Bell size={20} color={colors.textSecondary} style={styles.rowIcon} />
          <View>
            <Text style={styles.rowTitle}>Notifications</Text>
            <Text style={styles.rowSubtitle}>Push, Email alerts</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionLabel}>Support</Text>
      <Card style={styles.card}>
        <View style={[styles.row, styles.borderBottom]}>
          <HelpCircle size={20} color={colors.textSecondary} style={styles.rowIcon} />
          <Text style={styles.rowTitle}>Help Center</Text>
        </View>
        <View style={styles.row}>
          <LogOut size={20} color={colors.error} style={styles.rowIcon} />
          <Text style={styles.logoutText} onPress={logout}>Log Out</Text>
        </View>
      </Card>

      <Text style={styles.version}>Version 1.0.0 (Premium)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 120 },
  header: { alignItems: "center", marginBottom: 40 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.border, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  avatarText: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold" },
  name: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", tracking: -1, marginBottom: 8 },
  username: { color: colors.textSecondary, fontSize: 16 },
  sectionLabel: { color: colors.textSecondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: "bold", marginBottom: 12, marginLeft: 8 },
  card: { padding: 0, marginBottom: 32, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 20 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { marginRight: 16 },
  rowTitle: { color: colors.textPrimary, fontWeight: "500", fontSize: 16, marginBottom: 4 },
  rowSubtitle: { color: colors.textSecondary },
  logoutText: { color: colors.error, fontWeight: "500", fontSize: 16 },
  version: { color: colors.textMuted, textAlign: "center", fontSize: 12 },
});
