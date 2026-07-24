import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!username || !name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ username, name, email, password });
    } catch (err: any) {
      const data = err?.response?.data;
      const message = typeof data === "object" ? Object.values(data).flat().join(" ") : "Registration failed.";
      setError(message);
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
          <Text style={styles.title}>Create account.</Text>
          <Text style={styles.subtitle}>Join us and start splitting expenses.</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input label="FULL NAME" value={name} onChangeText={setName} placeholder="John Doe" />
          <Input label="USERNAME" autoCapitalize="none" autoCorrect={false} value={username} onChangeText={setUsername} placeholder="john.doe" />
          <Input label="EMAIL ADDRESS" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="john@example.com" />
          <Input label="PASSWORD" secureTextEntry value={password} onChangeText={setPassword} placeholder="Minimum 8 characters" />

          <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" style={{ marginTop: 24 }} />
        </View>

        <View style={styles.footer}>
          <Button title="Already have an account? Sign in" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 32, paddingVertical: 64 },
  header: { marginBottom: 48 },
  title: { color: colors.textPrimary, fontSize: 36, fontWeight: "bold", letterSpacing: -1, marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: 18 },
  form: { width: "100%" },
  errorBox: { backgroundColor: "#EF444420", borderColor: "#EF444450", borderWidth: 1, padding: 16, borderRadius: 12, marginBottom: 24 },
  errorText: { color: colors.error, fontWeight: "500" },
  footer: { marginTop: 48, alignItems: "center" },
});
