import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; 
import { COLORS } from "../constants/styles";

const RegisterScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

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
        e.response?.data?.message || "Impossible de créer le compte. Vérifie les champs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Créer un compte</Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Sauvegarde ta Watchlist, ta Wishlist et tes stats.
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        placeholder="Nom d'utilisateur"
        placeholderTextColor={theme.subText}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.subText}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        placeholder="Mot de passe"
        placeholderTextColor={theme.subText}
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
        onPress={() => navigation.replace("Login", { redirectTo })}
      >
        <Text style={[styles.linkText, { color: theme.subText }]}>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#28a745", // Vert conservation
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
    fontSize: 14,
  },
  linkTextBold: {
    color: "#007bff",
    fontWeight: "600",
  },
});