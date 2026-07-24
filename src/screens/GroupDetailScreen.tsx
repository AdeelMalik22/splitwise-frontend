import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Keyboard, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getGroup, addMember } from "../api/groups";
import { listExpenses } from "../api/expenses";
import { Group, Expense } from "../types/models";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Receipt, UserPlus } from "lucide-react-native";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "GroupDetail">;

export default function GroupDetailScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const load = useCallback(async () => {
    try {
      const [g, exp] = await Promise.all([getGroup(groupId), listExpenses(groupId)]);
      setGroup(g);
      setExpenses(exp);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleAddMember() {
    const uid = parseInt(newMemberId.trim(), 10);
    if (isNaN(uid)) {
      Alert.alert("Invalid ID", "Please enter a valid numeric User ID.");
      return;
    }
    setAddingMember(true);
    Keyboard.dismiss();
    try {
      await addMember(groupId, uid);
      Alert.alert("Success", "Member added to group!");
      setNewMemberId("");
      setShowAddMember(false);
      load();
    } catch (err) {
      Alert.alert("Error", "Could not add user. Make sure the ID is correct.");
    } finally {
      setAddingMember(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>{route.params.groupName}</Text>
              <Text style={styles.subtitle}>Track shared expenses</Text>
            </View>

            <View style={styles.actions}>
              <Button title="Settle Up" variant="secondary" style={styles.actionBtn} onPress={() => navigation.navigate("Settlements", { groupId })} />
              <Button title="Add Expense" style={styles.actionBtn2} onPress={() => navigation.navigate("AddExpense", { groupId })} />
            </View>

            <View style={{ marginTop: 16 }}>
               <Button title="Add Member" variant="secondary" onPress={() => setShowAddMember(true)} />
            </View>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <Receipt size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.emptyTitle}>No expenses yet</Text>
              <Text style={styles.emptyDesc}>Tap 'Add Expense' to create the first bill for this group.</Text>
            </View>
          ) : (
            <ActivityIndicator color="#FFFFFF" style={{ marginTop: 80 }} />
          )
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardIconBox}>
              <Receipt size={20} color="#FFFFFF" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.paid_by.length > 0 ? "You paid" : "Someone paid"}</Text>
            </View>
            <View style={styles.cardAmountBox}>
              <Text style={styles.cardAmount}>₹{item.amount}</Text>
            </View>
          </Card>
        )}
      />

      {showAddMember && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>Add Member</Text>
          <Input 
            label="USER ID"
            keyboardType="number-pad" 
            value={newMemberId} 
            onChangeText={setNewMemberId} 
            placeholder="Enter their User ID" 
            autoFocus 
          />
          <View style={styles.sheetActions}>
            <Button title="Cancel" variant="secondary" style={styles.cancelBtn} onPress={() => { setShowAddMember(false); setNewMemberId(""); Keyboard.dismiss(); }} />
            <Button title="Add" loading={addingMember} style={{ flex: 1 }} onPress={handleAddMember} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 24 },
  header: { marginBottom: 32 },
  headerTop: { marginBottom: 24 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", letterSpacing: -1, marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 14 },
  actions: { flexDirection: "row" },
  actionBtn: { flex: 1, marginRight: 16 },
  actionBtn2: { flex: 1 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 80, marginTop: 40 },
  emptyIconBox: { width: 64, height: 64, backgroundColor: colors.surface, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  emptyTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptyDesc: { color: colors.textSecondary, textAlign: "center", paddingHorizontal: 32, lineHeight: 24 },
  card: { flexDirection: "row", alignItems: "center", marginBottom: 12, padding: 16 },
  cardIconBox: { width: 48, height: 48, backgroundColor: colors.border, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
  cardInfo: { flex: 1, marginRight: 16 },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  cardSubtitle: { color: colors.textSecondary, fontSize: 14 },
  cardAmountBox: { alignItems: "flex-end" },
  cardAmount: { color: colors.textPrimary, fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  bottomSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.secondaryBg, borderWidth: 1, borderColor: colors.border, padding: 24, paddingBottom: 48, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  sheetTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  sheetActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  cancelBtn: { flex: 1, marginRight: 16 },
});
