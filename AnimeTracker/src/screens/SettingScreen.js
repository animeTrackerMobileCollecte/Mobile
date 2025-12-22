import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useAnime } from "../context/AnimeContext";

export default function SettingsScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { resetUserData } = useAnime();

    const handleLogout = async () => {
        // 1. On vide les animes (AnimeContext)
        resetUserData();

        // 2. On supprime le token (AuthContext)
        await logout();
    };
  

  return (
    <View style={styles.container}>
      {isAuthenticated ? ( //Si l'utilisateur est connecté
        <>
          <Text style={styles.title}>Paramètres</Text>

          <View style={styles.userBox}>
            <Text style={styles.label}>Connecté en tant que :</Text>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              handleLogout();
              navigation.replace("Tabs"); // retourne à Home après logout
            }}
          >
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.dashboardButton}>
              📊 Voir le Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("DashboardStats")}>
            <Text style={styles.dashboardButton}>
              📊 Voir mes analyses
            </Text>
          </TouchableOpacity>
          {user?.role === "admin" && (
            <TouchableOpacity onPress={() => navigation.navigate("AdminUsers")}>
              <Text style={styles.dashboardButton}>
                🛠️ Gestion des utilisateurs
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        //Si l'utilisateur n'est pas connecté
        <>
          <Text style={styles.notConnected}>Vous n'êtes pas connecté.</Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>Se connecter</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  userBox: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
  },
  email: {
    fontSize: 15,
    color: "#777",
  },
  logoutButton: {
    backgroundColor: "#e63946",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  notConnected: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dashboardButton: {
    backgroundColor: "grey",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15, // ajoute de l’espace avec le bouton précédent
  },
});
