// src/screens/LoginScreen.js
import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ActivityIndicator} from "react-native";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation, route }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = route.params?.redirectTo || "Home";

  const handleLogin = async () => {
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // Retourner là d'où on vient, sinon Home
      navigation.replace("Tabs");
    } catch (e) {
      console.log("Login error:", e.response?.data || e.message);
      setError(
        e.response?.data?.message ||
          "Impossible de se connecter. Vérifie tes infos."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue 👋</Text>
      <Text style={styles.subtitle}>Connecte-toi pour gérer tes listes.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleLogin}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() =>
          navigation.replace("Register", {
            redirectTo,
          })
        }
      >
        <Text style={styles.linkText}>
          Pas de compte ?{" "}
          <Text style={styles.linkTextBold}>Créer un compte</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#555",
  },
  linkTextBold: {
    color: "#007bff",
    fontWeight: "600",
  },
});
