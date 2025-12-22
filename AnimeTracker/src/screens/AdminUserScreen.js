import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import client from "../api/Clients";
import { useAuth } from "../context/AuthContext";
import { globalStyles, COLORS } from "../constants/styles";

export default function AdminUsersScreen({ navigation }) {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = !!user && user.role === "admin";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await client.get("/users");
      setUsers(res.data || []);
    } catch (e) {
      console.log("Fetch users error:", e?.response?.data || e.message);
      Alert.alert("Erreur", "Impossible de récupérer la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Connexion requise", "Connecte-toi pour accéder à cette page.");
      navigation.goBack();
      return;
    }
    if (!isAdmin) {
      Alert.alert("Accès refusé", "Cette page est réservée aux administrateurs.");
      navigation.goBack();
      return;
    }
    fetchUsers();
  }, []);

  const confirmDelete = (targetUser) => {
    if (targetUser._id === user._id) {
      Alert.alert("Action interdite", "Tu ne peux pas supprimer ton propre compte admin.");
      return;
    }

    Alert.alert(
      "Supprimer l'utilisateur",
      `Supprimer ${targetUser.username || targetUser.email} ?\nCette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => handleDelete(targetUser._id),
        },
      ]
    );
  };

  const handleDelete = async (userId) => {
    try {
      await client.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      Alert.alert("Succès", "Utilisateur supprimé.");
    } catch (e) {
      console.log("Delete user error:", e?.response?.data || e.message);
      Alert.alert("Erreur", e?.response?.data?.message || "Suppression impossible.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.header, { marginBottom: 10 }]}>
        <Text style={globalStyles.headerTitle}>Admin — Utilisateurs</Text>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Retour</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isSelf = item._id === user._id;
            return (
              <View
                style={{
                  backgroundColor: COLORS.lightGray,
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "700", color: COLORS.darkText }}>
                  {item.username || "Sans username"}{" "}
                  <Text style={{ fontWeight: "500", color: COLORS.lightText }}>
                    ({item.role})
                  </Text>
                </Text>

                <Text style={{ color: COLORS.lightText, marginTop: 4 }}>
                  {item.email}
                </Text>

                <TouchableOpacity
                  disabled={isSelf}
                  onPress={() => confirmDelete(item)}
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    backgroundColor: isSelf ? "#ddd" : "#fee2e2",
                  }}
                >
                  <Text style={{ color: isSelf ? "#777" : "#b91c1c", fontWeight: "700" }}>
                    {isSelf ? "Ton compte" : "Supprimer"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={{ color: COLORS.lightText, textAlign: "center", marginTop: 30 }}>
              Aucun utilisateur trouvé.
            </Text>
          }
        />
      )}
    </View>
  );
}
