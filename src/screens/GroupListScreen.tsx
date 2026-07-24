import React, { useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl, ActivityIndicator, Keyboard, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { listGroups, createGroup } from "../api/groups";
import { Group } from "../types/models";
import { Button } from "../components/ui/Button";
import { PressableCard } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Users, ChevronRight, Plus } from "lucide-react-native";
import { colors } from "../theme";

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
      // Silent error for now
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
    Keyboard.dismiss();
    try {
      await createGroup({ name: newGroupName.trim() });
      setNewGroupName("");
      setShowNewGroup(false);
      fetchGroups();
    } catch {
      // Error handling
    } finally {
      setCreating(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchGroups(); }} tintColor="#FFFFFF" />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <Users size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.emptyTitle}>No groups yet</Text>
              <Text style={styles.emptyDesc}>Create your first group to start tracking shared expenses with friends.</Text>
            </View>
          ) : (
            <ActivityIndicator color="#FFFFFF" style={{ marginTop: 80 }} />
          )
        }
        renderItem={({ item }) => (
          <PressableCard
            style={styles.card}
            onPress={() => navigation.navigate("GroupDetail", { groupId: item.id, groupName: item.name })}
          >
            <View style={styles.cardIconBox}>
              <Users size={20} color="#FFFFFF" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Settled up</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </PressableCard>
        )}
      />

      {showNewGroup ? (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>New Group</Text>
          <Input value={newGroupName} onChangeText={setNewGroupName} placeholder="e.g. Ski Trip 2026" autoFocus />
          <View style={styles.sheetActions}>
            <Button title="Cancel" variant="secondary" style={styles.cancelBtn} onPress={() => { setShowNewGroup(false); setNewGroupName(""); Keyboard.dismiss(); }} />
            <Button title="Create" loading={creating} style={{ flex: 1 }} onPress={handleCreateGroup} />
          </View>
        </View>
      ) : (
        <View style={styles.fabContainer}>
          <Button title="" style={styles.fab} onPress={() => setShowNewGroup(true)} />
          <View style={styles.fabIcon}>
            <Plus color="#000" size={28} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", letterSpacing: -1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 120 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 80, marginTop: 40 },
  emptyIconBox: { width: 64, height: 64, backgroundColor: colors.surface, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  emptyTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptyDesc: { color: colors.textSecondary, textAlign: "center", paddingHorizontal: 32, lineHeight: 24 },
  card: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  cardIconBox: { width: 48, height: 48, backgroundColor: colors.border, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardSubtitle: { color: colors.textSecondary, fontSize: 14 },
  bottomSheet: { position: "absolute", bottom: 96, left: 16, right: 16, backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border, padding: 24, paddingBottom: 24, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  sheetTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  sheetActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  cancelBtn: { flex: 1, marginRight: 16 },
  fabContainer: { position: "absolute", bottom: 112, right: 24 },
  fab: { width: 64, height: 64, borderRadius: 32, shadowColor: "#FFFFFF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  fabIcon: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "center", pointerEvents: "none" },
});
