import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getGroup } from "../api/groups";
import { listExpenses } from "../api/expenses";
import { Group, Expense } from "../types/models";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Receipt } from "lucide-react-native";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "GroupDetail">;

export default function GroupDetailScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

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
              <Text style={styles.subtitle}>{group?.members?.length || 0} members</Text>
            </View>

            <View style={styles.actions}>
              <Button title="Settle Up" variant="secondary" style={styles.actionBtn} onPress={() => navigation.navigate("Settlements", { groupId })} />
              <Button title="Add Expense" style={styles.actionBtn2} onPress={() => navigation.navigate("AddExpense", { groupId })} />
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
              <Text style={styles.cardAmountLabel}>Lent</Text>
            </View>
          </Card>
        )}
      />
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
  cardAmount: { color: colors.success, fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  cardAmountLabel: { color: colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
});
