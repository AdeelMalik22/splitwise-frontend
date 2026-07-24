import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!username || !password) {
      setError("Please enter your credentials.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back.</Text>
          <Text style={styles.subtitle}>Sign in to your account.</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="USERNAME OR EMAIL"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            placeholder="john.doe"
          />
          <Input
            label="PASSWORD"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />

          <Button
            title="Continue"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={{ marginTop: 24 }}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Create an account"
            variant="ghost"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 32 },
  header: { marginBottom: 48 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", letterSpacing: -1, marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 18 },
  form: { width: "100%" },
  errorBox: { backgroundColor: "#EF444420", borderColor: "#EF444450", borderWidth: 1, padding: 16, borderRadius: 12, marginBottom: 24 },
  errorText: { color: colors.error, fontWeight: "500" },
  footer: { marginTop: 64, alignItems: "center" },
});
