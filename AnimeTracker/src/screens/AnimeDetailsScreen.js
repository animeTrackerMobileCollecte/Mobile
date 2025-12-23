import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAnime } from "../context/AnimeContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from '../context/AuthContext';
import { COLORS } from "../constants/styles";
import { sendNotification } from '../services/NotifService';

const { width } = Dimensions.get("window");

export default function AnimeDetailsScreen({ route, navigation }) {
  const { anime } = route.params;
  const { addToWishlist, startWatching, markAsCompleted } = useAnime();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);

const handleAddToList = () => {
    // 1. On vérifie d'abord si l'utilisateur est connecté
    if (!isAuthenticated) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter un animé à votre liste.",
        [
          { text: "Se connecter", onPress: () => navigation.navigate("Login") },
          { text: "Annuler", style: "cancel" }
        ]
      );
      return; // ON S'ARRÊTE ICI : Pas de notif, pas d'appel API
    }

    // 2. Si on est connecté, on propose le choix
    Alert.alert(
      "Ajouter à une liste",
      "Où voulez-vous placer cet animé ?",
      [
        { 
          text: "Watchlist", 
          onPress: async () => {
            const success = await startWatching(anime.malId || anime.id);
            if (success) sendNotification("Watchlist mise à jour ! 📺", `${anime.title} ajouté.`);
          } 
        },
        { 
          text: "Wishlist", 
          onPress: async () => {
            const success = await addToWishlist(anime.malId || anime.id);
            if (success) sendNotification("Wishlist mise à jour ! ✨", `${anime.title} ajouté.`);
          } 
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const renderStars = () => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
            <Ionicons
              name={star <= userRating ? "star" : "star-outline"}
              size={32}
              color={COLORS.star}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Poster Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: anime.image || anime.imageUrl }} style={styles.mainImage} />
          <View style={styles.overlay} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{anime.title}</Text>
            <Text style={styles.headerJapanese}>{anime.title_japanese || ""}</Text>
          </View>
        </View>

        {/* Main Content Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <View style={styles.topRow}>
            <View style={styles.globalScore}>
              <Ionicons name="star" size={18} color={COLORS.star} />
              <Text style={[styles.scoreText, { color: theme.text }]}>
                {anime.rating || anime.jikanScore || "N/A"}
                <Text style={styles.globalLabel}> (Global)</Text>
              </Text>
            </View>
            
            <TouchableOpacity style={styles.addBtn} onPress={handleAddToList}>
              <Ionicons name="add" size={18} color="#FFF" />
              <Text style={styles.addBtnText}>Add to List</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>STATUS</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{anime.status || "Unknown"}</Text>
              <Text style={styles.statLabel}>YEAR</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{anime.year || "1998"}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>EPISODES</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{anime.episodes || "26"}</Text>
              <Text style={styles.statLabel}>STUDIO</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{anime.studio || "Sunrise"}</Text>
            </View>
          </View>

          {/* Genres badges */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Genres</Text>
          <View style={styles.genreRow}>
            {["Action", "Award Winning", "Sci-Fi"].map((g, i) => (
              <View key={i} style={[styles.genreBadge, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]}>
                <Text style={[styles.genreText, { color: COLORS.primary }]}>{g}</Text>
              </View>
            ))}
          </View>

          {/* Synopsis */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Synopsis</Text>
          <Text style={[styles.synopsisText, { color: theme.subText }]}>
            {anime.synopsis || "Crime is timeless. By the year 2071, humanity has expanded..."}
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}> Read more</Text>
          </Text>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={[styles.yourRatingTitle, { color: theme.text }]}>Your Rating</Text>
            {renderStars()}
            <Text style={{ color: theme.subText, marginVertical: 10 }}>
              {userRating > 0 ? `You rated this ${userRating}/5` : "Not rated yet"}
            </Text>
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: userRating > 0 ? COLORS.primary : "#A1A1A1" }]}>
              <Text style={styles.submitBtnText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { width: "100%", height: 400 },
  mainImage: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  backBtn: { position: "absolute", top: 50, left: 20, backgroundColor: "rgba(0,0,0,0.5)", padding: 8, borderRadius: 20 },
  headerInfo: { position: "absolute", bottom: 50, left: 20 },
  headerTitle: { color: "#FFF", fontSize: 28, fontWeight: "bold" },
  headerJapanese: { color: "#CCC", fontSize: 14 },
  detailsCard: { marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  globalScore: { flexDirection: "row", alignItems: "center" },
  scoreText: { fontSize: 20, fontWeight: "bold", marginLeft: 8 },
  globalLabel: { fontSize: 12, fontWeight: "normal", color: "#888" },
  addBtn: { backgroundColor: COLORS.primary, flexDirection: "row", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, alignItems: "center" },
  addBtnText: { color: "#FFF", fontWeight: "bold", marginLeft: 5 },
  statsGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  statItem: { width: "45%" },
  statLabel: { fontSize: 10, color: "#888", marginBottom: 2, fontWeight: "bold" },
  statValue: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, marginTop: 10 },
  genreRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  genreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8, marginBottom: 8 },
  genreText: { fontSize: 12, fontWeight: "600" },
  synopsisText: { fontSize: 14, lineHeight: 22, textAlign: "justify" },
  ratingSection: { alignItems: "center", marginTop: 30, padding: 20, borderRadius: 20, backgroundColor: "rgba(128,128,128,0.05)" },
  yourRatingTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  starRow: { flexDirection: "row", marginBottom: 10 },
  submitBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 25, marginTop: 10 },
  submitBtnText: { color: "#FFF", fontWeight: "bold" },
});