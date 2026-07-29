import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { listGroups } from "../api/groups";
import { listExpenses, getSettlements } from "../api/expenses";
import { Expense } from "../types/models";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { PressableCard } from "../components/ui/Card";
import { ArrowUpRight, ArrowDownLeft, Receipt, Plus, Sparkles } from "lucide-react-native";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const { userId } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          // 1. Fetch recent activity (top 5 expenses)
          const allExpenses = await listExpenses();
          if (active) setExpenses(allExpenses.slice(0, 5));

          // 2. Fetch all groups to aggregate balances
          const groups = await listGroups();
          let totalOwe = 0;
          let totalOwed = 0;

          // Fetch settlements for each group concurrently
          const settlementsPromises = groups.map((g) => getSettlements(g.id).catch(() => null));
          const settlementsResults = await Promise.all(settlementsPromises);

          settlementsResults.forEach((settlement) => {
            if (!settlement) return;
            const toPay = settlement["You need to pay"] || [];
            const willGet = settlement["you will get"] || [];

            toPay.forEach((item) => {
              totalOwe += parseFloat(String(item.amount));
            });
            willGet.forEach((item) => {
              totalOwed += parseFloat(String(item.amount));
            });
          });

          if (active) {
            setYouOwe(totalOwe);
            setYouAreOwed(totalOwed);
          }
        } catch (error) {
          console.error("Dashboard fetch error:", error);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const totalBalance = youAreOwed - youOwe;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View style={styles.eyebrow}><Sparkles size={14} color={colors.accentDark} /><Text style={styles.eyebrowText}>YOUR MONEY, SIMPLIFIED</Text></View>
        <Text style={styles.greeting}>Good to see you</Text>
        <Text style={styles.headerLabel}>Total balance</Text>
        <Text style={styles.headerValue}>
          {totalBalance > 0 ? "+" : totalBalance < 0 ? "-" : ""}₹{Math.abs(totalBalance).toFixed(2)}
        </Text>
      </View>

      <View style={styles.balancesRow}>
        <View style={[styles.balanceBox, { marginRight: 16 }]}>
          <View style={styles.balanceBoxHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "#EF444420" }]}>
              <ArrowUpRight size={16} color={colors.error} />
            </View>
            <Text style={styles.balanceLabel}>You Owe</Text>
          </View>
          <Text style={[styles.balanceValue, { color: colors.error }]}>₹{youOwe.toFixed(2)}</Text>
        </View>

        <View style={styles.balanceBox}>
          <View style={styles.balanceBoxHeader}>
            <View style={[styles.iconCircle, { backgroundColor: "#22C55E20" }]}>
              <ArrowDownLeft size={16} color={colors.success} />
            </View>
            <Text style={styles.balanceLabel}>You are owed</Text>
          </View>
          <Text style={[styles.balanceValue, { color: colors.success }]}>₹{youAreOwed.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsRow}>
          <Button title="Settle up" variant="secondary" onPress={() => navigation.navigate("GroupsTab" as any)} style={styles.actionBtn} />
          <Button title="New group" variant="primary" onPress={() => navigation.navigate("GroupsTab" as any)} style={styles.actionBtn2} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} style={{ marginTop: 20 }} />
        ) : expenses.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 20 }}>No recent activity.</Text>
        ) : (
          expenses.map((expense) => {
            const userPaid = userId ? expense.paid_by.includes(userId) : false;
            return (
              <PressableCard key={expense.id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <Receipt size={20} color="#FFFFFF" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName} numberOfLines={1}>{expense.name}</Text>
                  <Text style={styles.activityDesc}>{userPaid ? "You paid" : "Someone paid"}</Text>
                </View>
                <Text style={styles.activityAmount}>₹{expense.amount}</Text>
              </PressableCard>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 130 },
  header: { marginBottom: 28 },
  eyebrow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 18 },
  eyebrowText: { color: colors.accentDark, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  greeting: { color: colors.textPrimary, fontSize: 30, fontWeight: "800", letterSpacing: -0.8, marginBottom: 28 },
  headerLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: "700", marginBottom: 6 },
  headerValue: { color: colors.textPrimary, fontSize: 48, fontWeight: "800", letterSpacing: -1 },
  balancesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  balanceBox: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16 },
  balanceBoxHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 12 },
  balanceLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  balanceValue: { fontSize: 24, fontWeight: "bold" },
  section: { marginBottom: 40 },
  sectionTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "800", marginBottom: 16 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  actionBtn: { flex: 1, marginRight: 16 },
  actionBtn2: { flex: 1 },
  activityCard: { flexDirection: "row", alignItems: "center", padding: 16, marginBottom: 12 },
  activityIcon: { width: 48, height: 48, backgroundColor: colors.border, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
  activityInfo: { flex: 1, marginRight: 16 },
  activityName: { color: colors.textPrimary, fontSize: 16, fontWeight: "600", marginBottom: 4 },
  activityDesc: { color: colors.textSecondary, fontSize: 14 },
  activityAmount: { color: colors.textPrimary, fontSize: 16, fontWeight: "bold" },
});
