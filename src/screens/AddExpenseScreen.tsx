import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { createExpense } from "../api/expenses";
import { useAuth } from "../context/AuthContext";
import LabeledInput from "../components/LabeledInput";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

export default function AddExpenseScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { userId } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  // Comma-separated participant user IDs, e.g. "1,2,3" — these go into `split_on`.
  // Swap this out for a real member picker once you can fetch group members.
  const [splitOnIds, setSplitOnIds] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !amount.trim()) {
      Alert.alert("Missing info", "Enter a name and amount.");
      return;
    }
    const splitOn = splitOnIds
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));

    if (splitOn.length === 0) {
      Alert.alert("Missing participants", "Enter at least one participant user ID.");
      return;
    }

    const paidBy = userId ? [userId] : splitOn.slice(0, 1);

    setLoading(true);
    try {
      await createExpense({
        group_id: groupId,
        name: name.trim(),
        description: description.trim(),
        amount: parseFloat(amount.trim()),
        paid_by: paidBy,
        split_on: splitOn,
      });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", "Could not save this expense. Check the amount and participant IDs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <LabeledInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Dinner at the beach shack"
      />
      <LabeledInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Split equally among all"
      />
      <LabeledInput
        label="Amount"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        placeholder="1200.00"
      />
      <LabeledInput
        label="Participant user IDs (comma separated)"
        value={splitOnIds}
        onChangeText={setSplitOnIds}
        placeholder="1, 2, 3"
      />
      <Text style={styles.hint}>
        The logged-in user is automatically set as the payer. Participants are split equally.
      </Text>
      <PrimaryButton title="Save Expense" onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hint: { color: colors.subtext, fontSize: 12, marginBottom: spacing.md },
});

