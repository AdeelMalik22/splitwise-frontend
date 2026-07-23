import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { getSettlements } from "../api/expenses";
import { SettlementsResponse } from "../types/models";
import { colors, spacing } from "../theme";

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
          Alert.alert("Error", "Could not load settlements.");
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [groupId])
  );

  const needToPay = settlements?.["You need to pay"] ?? [];
  const willGet = settlements?.["you will get"] ?? [];
  const allSettled = !loading && needToPay.length === 0 && willGet.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      {allSettled && (
        <Text style={styles.empty}>Everyone's settled up. Nothing owed. 🎉</Text>
      )}

      {needToPay.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>You need to pay</Text>
          {needToPay.map((item, i) => (
            <View key={i} style={[styles.card, styles.cardOwed]}>
              <Text style={styles.line}>To: {item.to_user}</Text>
              <Text style={styles.amount}>₹{item.amount}</Text>
            </View>
          ))}
        </>
      )}

      {willGet.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>You will receive</Text>
          {willGet.map((item, i) => (
            <View key={i} style={[styles.card, styles.cardGain]}>
              <Text style={styles.line}>From: {item.from_user}</Text>
              <Text style={styles.amount}>₹{item.amount}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardOwed: {
    backgroundColor: "#fff5f5",
    borderColor: "#f5c6cb",
  },
  cardGain: {
    backgroundColor: "#f0fff4",
    borderColor: "#c3e6cb",
  },
  line: { fontSize: 15, color: colors.text, fontWeight: "600" },
  amount: { fontSize: 16, color: colors.primaryDark, fontWeight: "700" },
  empty: { textAlign: "center", color: colors.subtext, marginTop: spacing.xl, fontSize: 15 },
});

