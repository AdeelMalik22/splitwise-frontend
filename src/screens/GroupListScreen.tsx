import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { listGroups, createGroup } from "../api/groups";
import { Group } from "../types/models";
import { colors, spacing, radius, shadows, typography } from "../theme";
import PrimaryButton from "../components/PrimaryButton";
import LabeledInput from "../components/LabeledInput";

type Props = NativeStackScreenProps<RootStackParamList, "GroupList">;

export default function GroupListScreen({ navigation }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const data = await listGroups();
      setGroups(data);
    } catch (err) {
      Alert.alert("Error", "Could not load your groups.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups])
  );

  async function handleCreateGroup() {
    if (!newGroupName.trim()) return;
    setCreating(true);
    try {
      await createGroup({ name: newGroupName.trim() });
      setNewGroupName("");
      setShowNewGroup(false);
      fetchGroups();
    } catch {
      Alert.alert("Error", "Could not create the group.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Your Groups</Text>
        <Pressable 
          onPress={() => navigation.navigate("Profile")}
          style={({ pressed }) => [styles.profileBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.profileEmoji}>👤</Text>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchGroups();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptyDesc}>
                Create your first group to start splitting expenses with friends.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed
            ]}
            onPress={() =>
              navigation.navigate("GroupDetail", {
                groupId: item.id,
                groupName: item.name,
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            {item.description ? (
              <Text style={styles.groupDesc}>{item.description}</Text>
            ) : null}
            <Text style={styles.groupDate}>
              Created {new Date(item.created || "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
            </Text>
          </Pressable>
        )}
      />

      <View style={styles.footer}>
        {showNewGroup ? (
          <View style={styles.newGroupForm}>
            <Text style={styles.formTitle}>Create a New Group</Text>
            <LabeledInput
              label="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="e.g. Goa Trip 2026"
            />
            <View style={styles.formActions}>
              <PrimaryButton
                title="Cancel"
                variant="ghost"
                onPress={() => {
                  setShowNewGroup(false);
                  setNewGroupName("");
                }}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <PrimaryButton
                title="Create"
                onPress={handleCreateGroup}
                loading={creating}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <PrimaryButton 
            title="+ New Group" 
            size="lg" 
            onPress={() => setShowNewGroup(true)} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  screenTitle: {
    ...typography.h1,
    color: colors.text,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceHigh,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  profileEmoji: { fontSize: 20 },
  
  listContent: { 
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.md,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  groupName: { ...typography.h3, color: colors.text },
  chevron: { fontSize: 24, color: colors.textSecondary, marginTop: -4 },
  groupDesc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  groupDate: { ...typography.caption, color: colors.textMuted },
  
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 1.5,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  emptyDesc: { ...typography.body, color: colors.textSecondary, textAlign: "center", lineHeight: 22 },
  
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: "rgba(15, 15, 26, 0.85)", // background color with opacity
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  newGroupForm: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.lg,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  formActions: {
    flexDirection: "row",
    marginTop: spacing.xs,
  }
});
