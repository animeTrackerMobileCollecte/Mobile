// src/screens/RegisterScreen.js
import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ActivityIndicator} from "react-native";
import { useAuth } from "../context/AuthContext";

const RegisterScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = route.params?.redirectTo || "Home";

  const handleRegister = async () => {
    setError("");
    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigation.replace("Login");
    } catch (e) {
      console.log("Register error:", e.response?.data || e.message);
      setError(
        e.response?.data?.message ||
          "Impossible de créer le compte. Vérifie les champs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>
        Sauvegarde ta Watchlist, ta Wishlist et tes stats.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />

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
        onPress={handleRegister}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() =>
          navigation.replace("Login", {
            redirectTo,
          })
        }
      >
        <Text style={styles.linkText}>
          Déjà un compte ?{" "}
          <Text style={styles.linkTextBold}>Se connecter</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

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
    backgroundColor: "#28a745",
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
