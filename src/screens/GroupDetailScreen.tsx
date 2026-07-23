import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getGroup } from "../api/groups";
import { listExpenses } from "../api/expenses";
import { Group, Expense } from "../types/models";
import { colors, spacing } from "../theme";
import PrimaryButton from "../components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "GroupDetail">;

export default function GroupDetailScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [g, exp] = await Promise.all([
        getGroup(groupId),
        listExpenses(groupId),
      ]);
      setGroup(g);
      setExpenses(exp);
    } catch {
      Alert.alert("Error", "Could not load this group.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <PrimaryButton
          title="Add Expense"
          onPress={() => navigation.navigate("AddExpense", { groupId })}
          style={{ flex: 1, marginRight: spacing.sm }}
        />
        <PrimaryButton
          title="Settlements"
          variant="outline"
          onPress={() => navigation.navigate("Settlements", { groupId })}
          style={{ flex: 1 }}
        />
      </View>

      {group?.members?.length ? (
        <Text style={styles.membersLine}>
          Members: {group.members.map((m) => m.name || m.username).join(", ")}
        </Text>
      ) : null}

      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No expenses yet in this group.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.desc}>{item.name}</Text>
              {!!item.description && (
                <Text style={styles.subdesc}>{item.description}</Text>
              )}
            </View>
            <Text style={styles.amount}>₹{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  actionsRow: {
    flexDirection: "row",
    padding: spacing.md,
  },
  membersLine: {
    paddingHorizontal: spacing.md,
    color: colors.subtext,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  desc: { fontSize: 15, fontWeight: "600", color: colors.text },
  subdesc: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "700", color: colors.primaryDark },
  empty: { textAlign: "center", color: colors.subtext, marginTop: spacing.xl },
});
