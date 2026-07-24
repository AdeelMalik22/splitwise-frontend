import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { createExpense } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

export default function AddExpenseScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { userId } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitOnIds, setSplitOnIds] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !amount.trim()) {
      Alert.alert("Missing info", "Please enter a name and amount.");
      return;
    }
    const splitOn = splitOnIds.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));

    if (splitOn.length === 0) {
      Alert.alert("Missing participants", "Enter at least one participant user ID.");
      return;
    }

    const paidBy = userId ? [userId] : splitOn.slice(0, 1);

    setLoading(true);
    Keyboard.dismiss();
    try {
      await createExpense({ group_id: groupId, name: name.trim(), description: description.trim(), amount: parseFloat(amount.trim()), paid_by: paidBy, split_on: splitOn });
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
        
        <Input label="SPLIT WITH WHO?" value={splitOnIds} onChangeText={setSplitOnIds} placeholder="Enter user IDs separated by commas" hint="Example: 1, 2, 3" />
        <Input label="NOTES (OPTIONAL)" value={description} onChangeText={setDescription} placeholder="Add any additional details here" />

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
  footer: { marginTop: 32 },
});
