import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";


import { useAnime } from "../context/AnimeContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from '../context/AuthContext';


import { COLORS } from "../constants/styles";
import { sendNotification } from '../services/NotifService';

const { width } = Dimensions.get("window");

export default function AnimeDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { addToWishlist, startWatching, rateAnime } = useAnime();
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  
  const mainBgColor = isDarkMode ? "#121212" : "#FFF";
  const contentBgColor = isDarkMode ? "#1E1E1E" : "#FFF";
  const statsGridColor = isDarkMode ? "#2C2C2C" : "#F6F7FB";
  const textColor = isDarkMode ? "#FFF" : "#111";
  const subTextColor = isDarkMode ? "#AAA" : "#6B7280";

  const { anime } = route.params || {};

  const [rating, setRating] = useState(anime?.personalScore ? anime.personalScore : 0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!anime) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: mainBgColor }]}>
        <Text style={{ color: textColor }}>Erreur : Impossible de charger les détails.</Text>
        <TouchableOpacity style={styles.backButtonSimple} onPress={() => navigation.goBack()}>
            <Text style={{color: '#FFF'}}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  const handleAddToList = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter un animé à votre liste.",
        [
          { text: "Se connecter", onPress: () => navigation.navigate("Login") },
          { text: "Annuler", style: "cancel" }
        ]
      );
      return;
    }

    Alert.alert(
      "Ajouter à une liste",
      "Où voulez-vous placer cet animé ?",
      [
        { 
          text: "Watchlist (En cours)", 
          onPress: async () => {
            const success = await startWatching(anime.malId || anime.id);
            if (success) sendNotification("Watchlist mise à jour ! 📺", `${anime.title} ajouté.`);
          } 
        },
        { 
          text: "Wishlist (À voir)", 
          onPress: async () => {
            const success = await addToWishlist(anime.malId || anime.id);
            if (success) sendNotification("Wishlist mise à jour ! ✨", `${anime.title} ajouté.`);
          } 
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

 
  const handleStarPress = (starIndex) => setRating(starIndex);

  const handleSubmitRating = async () => {
    if (!isAuthenticated) {
        Alert.alert("Erreur", "Connectez-vous pour noter.");
        return;
    }
    if (rating > 0) {
      await rateAnime(anime.malId || anime.id, rating);
      
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView style={[styles.container, { backgroundColor: mainBgColor }]} showsVerticalScrollIndicator={false}>
        
        
        <ImageBackground
          source={{ uri: anime.imageUrl || anime.image || "https://via.placeholder.com/400" }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.9)"]}
            style={styles.gradient}
          >
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.animeTitle}>{anime.title}</Text>
              <Text style={styles.animeSubTitle}>
                {anime.title_japanese ? anime.title_japanese : "Titre original N/A"}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        
        <View style={[styles.contentContainer, { backgroundColor: contentBgColor }]}>
          
          
          <View style={styles.ratingRow}>
            <View style={styles.globalRating}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={[styles.ratingText, { color: textColor }]}>
                {anime.rating || anime.jikanScore || "N/A"}
              </Text>
              <Text style={styles.voteCount}>(Global)</Text>
            </View>

            <TouchableOpacity
              style={styles.addListBtn}
              activeOpacity={0.9}
              onPress={handleAddToList}
            >
              <Ionicons name="add" size={18} color="#FFF" />
              <Text style={styles.addListText}>Add to List</Text>
            </TouchableOpacity>
          </View>

          
          <View style={[styles.statsGrid, { backgroundColor: statsGridColor }]}>
            <InfoBox label="STATUS" value={anime.status || anime.publicationStatus || "Unknown"} textColor={textColor} subTextColor={subTextColor} />
            <InfoBox label="EPISODES" value={anime.episodes ? String(anime.episodes) : "?"} textColor={textColor} subTextColor={subTextColor} />
            <InfoBox label="YEAR" value={anime.year ? String(anime.year) : "?"} textColor={textColor} subTextColor={subTextColor} />
            <InfoBox label="STUDIO" value={anime.studio || "Unknown"} textColor={textColor} subTextColor={subTextColor} />
          </View>

          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Genres</Text>
            <View style={styles.genreContainer}>
              {anime.genres && anime.genres.length > 0 ? (
                anime.genres.map((genreName, index) => (
                  <GenreChip 
                    key={index} 
                    label={typeof genreName === 'string' ? genreName : genreName.name} 
                    isDarkMode={isDarkMode} 
                  />
                ))
              ) : (
                <Text style={{ color: "gray" }}>Aucun genre listé</Text>
              )}
            </View>
          </View>

          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Synopsis</Text>
            <Text
              style={[styles.synopsisText, { color: isDarkMode ? "#DDD" : "#4B5563" }]}
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

          
          <View style={styles.ratingSection}>
            <Text style={[styles.ratingTitle, { color: textColor }]}>Your Rating</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                  <Ionicons
                    name={rating >= star ? "star" : "star-outline"}
                    size={40}
                    color={rating >= star ? "#FFD700" : (isDarkMode ? "#555" : "#CCC")}
                    style={{ marginHorizontal: 5 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.ratingLabel, { color: subTextColor }]}>
                {rating > 0 ? `${rating}/5` : "Not rated yet"}
            </Text>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: rating > 0 ? COLORS.primary || "#6C63FF" : "#AAA" },
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



const InfoBox = ({ label, value, textColor, subTextColor }) => (
  <View style={styles.infoBox}>
    <Text style={[styles.infoLabel, { color: subTextColor }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: textColor }]} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const GenreChip = ({ label, isDarkMode }) => {
  
  const colors = isDarkMode 
    ? ["#374151", "#1F2937", "#4B5563", "#334155", "#111827"] 
    : ["#E0F7FA", "#F3E5F5", "#FFF3E0", "#E8F5E9", "#FFEBEE"];
    
  const textColors = isDarkMode
    ? ["#A5F3FC", "#E9D5FF", "#FFEDD5", "#BBF7D0", "#FECACA"]
    : ["#006064", "#4A148C", "#E65100", "#1B5E20", "#B71C1C"];

  const index = label.length % colors.length;

  return (
    <View style={[styles.chip, { backgroundColor: colors[index] }]}>
      <Text style={[styles.chipText, { color: textColors[index] }]}>{label}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButtonSimple: { marginTop: 20, padding: 10, backgroundColor: "#6C63FF", borderRadius: 8 },
  headerImage: { width: "100%", height: 350 },
  gradient: { flex: 1, justifyContent: "space-between", padding: 20, paddingTop: 50 },
  headerButtons: { flexDirection: "row", justifyContent: "space-between" },
  iconBtn: { backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 20 },
  titleContainer: { marginBottom: 30 },
  animeTitle: { color: "#FFF", fontSize: 28, fontWeight: "bold", textShadowColor: "rgba(0,0,0,0.7)", textShadowRadius: 10 },
  animeSubTitle: { color: "#EEE", fontSize: 16, marginTop: 5, fontWeight: "500" },

  contentContainer: {
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 500,
  },

  ratingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  globalRating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 22, fontWeight: "bold", marginLeft: 8 },
  voteCount: { color: "#9CA3AF", marginLeft: 8, fontWeight: "500" },
  addListBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#6C63FF", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18 },
  addListText: { color: "#FFF", marginLeft: 8, fontWeight: "700" },

  statsGrid: {
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoBox: { width: "48%", marginBottom: 14 },
  infoLabel: { fontWeight: "700", fontSize: 12, marginBottom: 6 },
  infoValue: { fontWeight: "800", fontSize: 16 },

  section: { marginTop: 22 },
  sectionTitle: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  genreContainer: { flexDirection: "row", flexWrap: "wrap" },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, marginBottom: 10 },
  chipText: { fontWeight: "800" },

  synopsisText: { fontSize: 15, lineHeight: 22 },
  readMore: { marginTop: 10, color: "#6C63FF", fontWeight: "800" },

  ratingSection: { marginTop: 28, alignItems: "center", paddingVertical: 20 },
  ratingTitle: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  starsContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingLabel: { marginTop: 10, fontWeight: "700" },
  submitBtn: { marginTop: 14, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, width: "100%", alignItems: "center" },
  submitBtnText: { color: "#FFF", fontWeight: "800" },
});