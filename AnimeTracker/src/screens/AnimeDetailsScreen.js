import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  Pressable,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAnime } from "../context/AnimeContext";

const { width } = Dimensions.get("window");

export default function AnimeDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { rateAnime } = useAnime();
    

  const { anime } = route.params || {};

  // SÉCURITÉ : si pas d'anime
  if (!anime) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erreur : Impossible de charger les détails.</Text>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // --- ÉTATS LOCAUX ---
  const [rating, setRating] = useState(anime.personalScore ? anime.personalScore / 2 : 0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

 

  

  

  // Texte bouton selon status
 

  

  // --- LOGIQUE DE NOTATION ---
  const handleStarPress = (starIndex) => {
    setRating(starIndex);
  };

  const handleSubmitRating = () => {
    if (rating > 0) {
      rateAnime(anime.malId, rating);
    }
  };

  

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="light-content" />

        {/* --- HEADER IMAGE --- */}
        <ImageBackground
          source={{ uri: anime.imageUrl || "https://via.placeholder.com/400" }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          >
            {/* Header Buttons */}
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* TITRES */}
            <View style={styles.titleContainer}>
              <Text style={styles.animeTitle}>{anime.title}</Text>
              <Text style={styles.animeSubTitle}>
                {anime.title_japanese ? anime.title_japanese : "Titre original N/A"}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* --- CONTENU BLANC ARRONDI --- */}
        <View style={styles.contentContainer}>
          {/* LIGNE : NOTE GLOBALE (Jikan Score) */}
          <View style={styles.ratingRow}>
            <View style={styles.globalRating}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {anime.rating || anime.jikanScore || "N/A"}
              </Text>
              <Text style={styles.voteCount}>(Global)</Text>
            </View>

            
            <TouchableOpacity
              style={styles.addListBtn}
              activeOpacity={0.9}
            >
              <Ionicons size={18} color="#FFF" />
              <Text style={styles.addListText}>Add to List</Text>
            </TouchableOpacity>
          </View>

          {/* --- GRID D'INFOS --- */}
          <View style={styles.statsGrid}>
            <InfoBox label="STATUS" value={anime.publicationStatus || "Unknown"} />
            <InfoBox label="EPISODES" value={anime.episodes ? String(anime.episodes) : "?"} />
            <InfoBox label="YEAR" value={anime.year ? String(anime.year) : "?"} />
            <InfoBox label="STUDIO" value={anime.studio || "Unknown"} />
          </View>

          {/* --- GENRES --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genreContainer}>
              {anime.genres && anime.genres.length > 0 ? (
                anime.genres.map((genreName, index) => (
                  <GenreChip key={index} label={genreName} />
                ))
              ) : (
                <Text style={{ color: "gray" }}>Aucun genre listé</Text>
              )}
            </View>
          </View>

          {/* --- SYNOPSIS --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text
              style={styles.synopsisText}
              numberOfLines={isDescriptionExpanded ? undefined : 4}
            >
              {anime.synopsis || "Aucune description disponible."}
            </Text>
            {anime.synopsis && anime.synopsis.length > 150 && (
              <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                <Text style={styles.readMore}>
                  {isDescriptionExpanded ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* --- TA ZONE DE NOTATION --- */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>Your Rating</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                  <Ionicons
                    name={rating >= star ? "star" : "star-outline"}
                    size={40}
                    color={rating >= star ? "#FFD700" : "#CCC"}
                    style={{ marginHorizontal: 5 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabel}>{rating > 0 ? `${rating}/5` : "Not rated yet"}</Text>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: rating > 0 ? "#6C63FF" : "#AAA" },
              ]}
              disabled={rating === 0}
              onPress={handleSubmitRating}
            >
              <Text style={styles.submitBtnText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>

     
    </>
  );
}

// --- PETITS COMPOSANTS (DESIGN) ---
const InfoBox = ({ label, value }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const GenreChip = ({ label }) => {
  const colors = ["#E0F7FA", "#F3E5F5", "#FFF3E0", "#E8F5E9", "#FFEBEE"];
  const textColors = ["#006064", "#4A148C", "#E65100", "#1B5E20", "#B71C1C"];
  const index = label.length % colors.length;

  return (
    <View style={[styles.chip, { backgroundColor: colors[index] }]}>
      <Text style={[styles.chipText, { color: textColors[index] }]}>{label}</Text>
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  headerImage: { width: "100%", height: 350 },
  gradient: { flex: 1, justifyContent: "space-between", padding: 20, paddingTop: 40 },
  headerButtons: { flexDirection: "row", justifyContent: "space-between" },
  iconBtn: { backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 20 },

  titleContainer: { marginBottom: 20 },
  animeTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowRadius: 10,
  },
  animeSubTitle: { color: "#EEE", fontSize: 16, marginTop: 5, fontWeight: "500" },

  contentContainer: {
    marginTop: -40,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 500,
  },

  ratingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  globalRating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 22, fontWeight: "bold", marginLeft: 8, color: "#111" },
  voteCount: { color: "#9CA3AF", marginLeft: 8, fontWeight: "500" },

  addListBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
  },
  addListText: { color: "#FFF", marginLeft: 8, fontWeight: "700" },

  statsGrid: {
    backgroundColor: "#F6F7FB",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoBox: { width: "48%", marginBottom: 14 },
  infoLabel: { color: "#9CA3AF", fontWeight: "700", fontSize: 12, marginBottom: 6 },
  infoValue: { color: "#111", fontWeight: "800", fontSize: 16 },

  section: { marginTop: 22 },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 12 },
  genreContainer: { flexDirection: "row", flexWrap: "wrap" },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, marginBottom: 10 },
  chipText: { fontWeight: "800" },

  synopsisText: { fontSize: 15, lineHeight: 22, color: "#4B5563" },
  readMore: { marginTop: 10, color: "#6C63FF", fontWeight: "800" },

  ratingSection: { marginTop: 28, alignItems: "center" },
  ratingTitle: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 12 },
  starsContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingLabel: { marginTop: 10, color: "#6B7280", fontWeight: "700" },
  submitBtn: { marginTop: 14, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, width: "100%", alignItems: "center" },
  submitBtnText: { color: "#FFF", fontWeight: "800" },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center", padding: 18 },
  modalCard: { width: "100%", borderRadius: 18, backgroundColor: "#FFF", padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  modalSubtitle: { marginTop: 6, marginBottom: 12, color: "#6B7280", fontWeight: "600" },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  modalBtnText: { fontSize: 15, fontWeight: "700", color: "#111" },
});
