import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useAnime } from "../context/AnimeContext";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../constants/styles";

export default function SettingsScreen({ navigation }) {
    const { user, logout, isAuthenticated } = useAuth();
    const { resetUserData } = useAnime();
    
    const { isDarkMode, toggleTheme } = useTheme();
    const theme = isDarkMode ? COLORS.dark : COLORS.light;

    const handleLogout = async () => {
        resetUserData();
        await logout();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Paramètres</Text>

            {/* BLOC DARK MODE */}
            <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Mode Sombre</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#767577", true: COLORS.primary }}
                    thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                />
            </View>

            {isAuthenticated ? (
                <>
                    <View style={styles.userBox}>
                        <Text style={[styles.label, { color: theme.subText }]}>Connecté en tant que :</Text>
                        <Text style={[styles.username, { color: theme.text }]}>{user?.username}</Text>
                        <Text style={[styles.email, { color: theme.subText }]}>{user?.email}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            handleLogout();
                            navigation.replace("Tabs");
                        }}
                    >
                        <Text style={styles.logoutText}>Se déconnecter</Text>
                    </TouchableOpacity>

                    {/* BOUTONS NAVIGATION DÉTAILLÉS */}
                    <TouchableOpacity 
                        style={[styles.dashboardButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]} 
                        onPress={() => navigation.navigate("Dashboard")}
                    >
                        <Text style={{ color: theme.text, fontWeight: "600" }}>📊 Voir le Dashboard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.dashboardButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]} 
                        onPress={() => navigation.navigate("DashboardStats")}
                    >
                        <Text style={{ color: theme.text, fontWeight: "600" }}>📈 Voir mes analyses</Text>
                    </TouchableOpacity>

                    {user?.role === "admin" && (
                        <TouchableOpacity 
                            style={[styles.dashboardButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]} 
                            onPress={() => navigation.navigate("AdminUsers")}
                        >
                            <Text style={{ color: theme.text, fontWeight: "600" }}>🛠️ Gestion des utilisateurs</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <>
                    <Text style={[styles.notConnected, { color: theme.text }]}>Vous n'êtes pas connecté.</Text>
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
    container: { flex: 1, padding: 20, justifyContent: "center" },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
    settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, marginBottom: 25 },
    settingLabel: { fontSize: 18, fontWeight: "500" },
    userBox: { marginBottom: 30 },
    label: { fontSize: 16 },
    username: { fontSize: 20, fontWeight: "600", marginTop: 4 },
    email: { fontSize: 15 },
    logoutButton: { backgroundColor: "#e63946", padding: 15, borderRadius: 10, alignItems: "center" },
    logoutText: { color: "white", fontSize: 16, fontWeight: "600" },
    notConnected: { fontSize: 18, marginBottom: 20, textAlign: "center" },
    loginButton: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, alignItems: "center" },
    loginText: { color: "white", fontSize: 16, fontWeight: "600" },
    dashboardButton: { padding: 15, borderRadius: 10, alignItems: "center", marginTop: 15 },
});