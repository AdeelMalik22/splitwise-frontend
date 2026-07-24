import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getSettlements } from "../api/expenses";
import { SettlementsResponse } from "../types/models";
import { CheckCircle2 } from "lucide-react-native";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Settlements">;

export default function SettlementsScreen({ route }: Props) {
  const { groupId } = route.params;
  const [settlements, setSettlements] = useState<SettlementsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const data = await getSettlements(groupId);
          if (active) setSettlements(data);
        } catch {
          // Silent error
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [groupId])
  );

  const needToPay = settlements?.["You need to pay"] ?? [];
  const willGet = settlements?.["you will get"] ?? [];
  const allSettled = !loading && needToPay.length === 0 && willGet.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Balances</Text>

      {loading && <ActivityIndicator color="#FFFFFF" style={{ marginTop: 80 }} />}

      {allSettled && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBox}>
            <CheckCircle2 size={32} color={colors.success} />
          </View>
          <Text style={styles.emptyTitle}>All settled up</Text>
          <Text style={styles.emptyDesc}>There are no outstanding balances in this group.</Text>
        </View>
      )}

      {needToPay.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Owe</Text>
          <View style={styles.card}>
            {needToPay.map((item, i) => (
              <View key={i} style={[styles.row, i !== needToPay.length - 1 && styles.borderBottom]}>
                <View style={styles.rowLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.to_user ? item.to_user.charAt(0).toUpperCase() : "?"}</Text>
                  </View>
                  <Text style={styles.rowName}>{item.to_user}</Text>
                </View>
                <Text style={[styles.amount, { color: colors.error }]}>₹{item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {willGet.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Are Owed</Text>
          <View style={styles.card}>
            {willGet.map((item, i) => (
              <View key={i} style={[styles.row, i !== willGet.length - 1 && styles.borderBottom]}>
                <View style={styles.rowLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.from_user ? item.from_user.charAt(0).toUpperCase() : "?"}</Text>
                  </View>
                  <Text style={styles.rowName}>{item.from_user}</Text>
                </View>
                <Text style={[styles.amount, { color: colors.success }]}>₹{item.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 64 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", letterSpacing: -1, marginBottom: 32 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 80, marginTop: 40 },
  emptyIconBox: { width: 64, height: 64, backgroundColor: colors.surface, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  emptyTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptyDesc: { color: colors.textSecondary, textAlign: "center", paddingHorizontal: 32, lineHeight: 24 },
  section: { marginBottom: 40 },
  sectionTitle: { color: colors.textSecondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: "bold", marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 16 },
  avatarText: { color: colors.textPrimary, fontSize: 18, fontWeight: "bold" },
  rowName: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  amount: { fontSize: 18, fontWeight: "bold" },
});
