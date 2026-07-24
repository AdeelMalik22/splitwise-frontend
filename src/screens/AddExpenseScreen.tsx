import React, { useState, useCallback } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { createExpense } from "../api/expenses";
import { getGroupUsers } from "../api/groups";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { User } from "../types/models";
import { CheckCircle2, Circle } from "lucide-react-native";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

export default function AddExpenseScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { userId } = useAuth();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [members, setMembers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useFocusEffect(
    useCallback(() => {
      getGroupUsers(groupId)
        .then((users) => {
          setMembers(users);
          // By default, select everyone to split the expense with
          setSelectedIds(new Set(users.map(u => u.id)));
        })
        .catch(() => {});
    }, [groupId])
  );

  const toggleMember = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function handleSubmit() {
    if (!name.trim() || !amount.trim()) {
      Alert.alert("Missing info", "Please enter a name and amount.");
      return;
    }

    if (selectedIds.size === 0) {
      Alert.alert("Missing participants", "Please select at least one person to split with.");
      return;
    }

    const splitOn = Array.from(selectedIds);
    // Paid by current user. If no userId, fallback to first selected.
    const paidBy = userId ? [userId] : [splitOn[0]];

    setLoading(true);
    Keyboard.dismiss();
    try {
      await createExpense({ 
        group_id: groupId, 
        name: name.trim(), 
        description: description.trim(), 
        amount: parseFloat(amount.trim()), 
        paid_by: paidBy, 
        split_on: splitOn 
      });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", "Could not save this expense.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Expense</Text>
        
        <Input label="WHAT WAS IT FOR?" value={name} onChangeText={setName} placeholder="e.g. Dinner, Uber, Groceries" autoFocus />
        <Input label="HOW MUCH?" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="₹0.00" containerStyle={{ marginBottom: 32 }} />

        <View style={styles.divider} />
        
        <Text style={styles.sectionLabel}>SPLIT WITH WHO?</Text>
        <View style={styles.membersList}>
          {members.length === 0 ? (
            <Text style={styles.emptyText}>Loading members...</Text>
          ) : (
            members.map((member) => (
              <TouchableOpacity key={member.id} style={styles.memberRow} onPress={() => toggleMember(member.id)} activeOpacity={0.7}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>{member.username.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.memberName}>{member.username}</Text>
                {selectedIds.has(member.id) ? (
                  <CheckCircle2 size={24} color={colors.success} />
                ) : (
                  <Circle size={24} color={colors.border} />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <Input label="NOTES (OPTIONAL)" value={description} onChangeText={setDescription} placeholder="Add any additional details here" containerStyle={{ marginTop: 24 }} />

        <View style={styles.footer}>
          <Button title="Save Expense" size="lg" onPress={handleSubmit} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 24, paddingBottom: 64, paddingTop: 32 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", letterSpacing: -1, marginBottom: 32 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 32 },
  sectionLabel: { color: colors.textSecondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: "bold", marginBottom: 16 },
  membersList: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  memberRow: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 16 },
  memberAvatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: "bold" },
  memberName: { flex: 1, color: colors.textPrimary, fontSize: 16, fontWeight: "500" },
  emptyText: { color: colors.textSecondary, padding: 20, textAlign: "center" },
  footer: { marginTop: 32 },
});
