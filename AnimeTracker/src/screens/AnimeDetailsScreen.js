import React, { useState } from 'react';
import { 
  View, Text, ImageBackground, StyleSheet, ScrollView, 
  TouchableOpacity, Dimensions, StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAnime } from '../context/AnimeContext';

const { width } = Dimensions.get('window');

export default function AnimeDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { rateAnime } = useAnime();
  // 1. On récupère les params, mais on met une sécurité {} au cas où params est vide
  const { anime } = route.params || {}; 
  

  // 2. SÉCURITÉ CRITIQUE : Si 'anime' n'existe pas, on affiche un chargement ou on rentre
  if (!anime) {
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Erreur : Impossible de charger les détails.</Text>
              <Button title="Retour" onPress={() => navigation.goBack()} />
          </View>
      );
  }

  // --- ÉTATS LOCAUX ---
  const [rating, setRating] = useState(anime.personalScore ? anime.personalScore / 2 : 0); // Si tu as déjà noté, on affiche ta note
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER IMAGE --- */}
      {/* Note: Ton model utilise 'imageUrl', pas 'image' */}
      <ImageBackground 
        source={{ uri: anime.imageUrl || 'https://via.placeholder.com/400' }} 
        style={styles.headerImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
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
            {/* Affichage du titre japonais (Nouveau champ) */}
            <Text style={styles.animeSubTitle}>
                {anime.title_japanese ? anime.title_japanese : 'Titre original N/A'}
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
            {/* Affichage du Score Jikan (ex: 8.75) */}
            <Text style={styles.ratingText}>
                {anime.rating || anime.jikanScore || 'N/A'}
            </Text>
            <Text style={styles.voteCount}>(Global)</Text>
          </View>
          
          <TouchableOpacity style={styles.addListBtn}>
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addListText}>Add to List</Text>
          </TouchableOpacity>
        </View>

        {/* --- GRID D'INFOS (Connecté à ton Model) --- */}
        <View style={styles.statsGrid}>
           <InfoBox label="STATUS" value={anime.publicationStatus || 'Unknown'} />
           <InfoBox label="EPISODES" value={anime.episodes ? String(anime.episodes) : '?'} />
           <InfoBox label="YEAR" value={anime.year ? String(anime.year) : '?'} />
           <InfoBox label="STUDIO" value={anime.studio || 'Unknown'} />
        </View>

        {/* --- GENRES (Boucle sur les strings) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.genreContainer}>
            {anime.genres && anime.genres.length > 0 ? (
                // Ton backend envoie maintenant ["Action", "Sci-Fi"] (Tableau de strings)
                anime.genres.map((genreName, index) => (
                    <GenreChip key={index} label={genreName} />
                ))
            ) : (
                <Text style={{color: 'gray'}}>Aucun genre listé</Text>
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
                <Text style={styles.readMore}>{isDescriptionExpanded ? "Show less" : "Read more"}</Text>
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
            
            <Text style={styles.ratingLabel}>
                {rating > 0 ? `${rating}/5` : "Not rated yet"}
            </Text>

            <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: rating > 0 ? '#6C63FF' : '#AAA' }]}
                disabled={rating === 0}
                onPress={handleSubmitRating}
            >
                <Text style={styles.submitBtnText}>Submit Rating</Text>
            </TouchableOpacity>
        </View>

        {/* Espace vide pour le scroll */}
        <View style={{ height: 50 }} />
      </View>
    </ScrollView>
  );
}

// --- PETITS COMPOSANTS (DESIGN) ---

const InfoBox = ({ label, value }) => (
    <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
);

// J'ai ajouté une logique de couleur aléatoire pour les genres, c'est plus joli
const GenreChip = ({ label }) => {
    // Petites couleurs pastel aléatoires basées sur le nom
    const colors = ["#E0F7FA", "#F3E5F5", "#FFF3E0", "#E8F5E9", "#FFEBEE"];
    const textColors = ["#006064", "#4A148C", "#E65100", "#1B5E20", "#B71C1C"];
    
    // Astuce pour avoir toujours la même couleur pour le même genre
    const index = label.length % colors.length;

    return (
        <View style={[styles.chip, { backgroundColor: colors[index] }]}>
            <Text style={[styles.chipText, { color: textColors[index] }]}>{label}</Text>
        </View>
    );
};

// --- STYLES (Identique à ton image) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerImage: { width: '100%', height: 350 }, // Image un peu plus haute
  gradient: { flex: 1, justifyContent: 'space-between', padding: 20, paddingTop: 40 },
  headerButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 20 },
  
  titleContainer: { marginBottom: 20 },
  animeTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.7)', textShadowRadius: 10 },
  animeSubTitle: { color: '#EEE', fontSize: 16, marginTop: 5, fontWeight: '500' },
  
  contentContainer: { 
      marginTop: -40, 
      backgroundColor: '#FFF', 
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 30, 
      padding: 24,
      minHeight: 500
  },
  
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  globalRating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 20, fontWeight: 'bold', marginLeft: 6, color: '#2D3436' },
  voteCount: { fontSize: 14, color: '#B2BEC3', marginLeft: 6 },
  
  addListBtn: { 
      backgroundColor: '#6C63FF', 
      flexDirection: 'row', 
      paddingVertical: 10, 
      paddingHorizontal: 20, 
      borderRadius: 25, 
      alignItems: 'center',
      shadowColor: "#6C63FF",
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5
  },
  addListText: { color: '#FFF', fontWeight: 'bold', marginLeft: 6, fontSize: 14 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25, backgroundColor: '#FAFAFA', borderRadius: 16, padding: 15 },
  infoBox: { width: '48%', marginBottom: 15 },
  infoLabel: { fontSize: 12, color: '#B2BEC3', fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase' },
  infoValue: { fontSize: 16, color: '#2D3436', fontWeight: '700' },

  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2D3436' },
  genreContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, marginBottom: 10 },
  chipText: { fontSize: 13, fontWeight: '600' },

  synopsisText: { color: '#636E72', lineHeight: 24, fontSize: 15 },
  readMore: { color: '#6C63FF', fontWeight: 'bold', marginTop: 8 },

  ratingSection: { marginTop: 10, padding: 25, backgroundColor: '#F8F8FF', borderRadius: 25, alignItems: 'center' },
  ratingTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginBottom: 15 },
  starsContainer: { flexDirection: 'row', marginBottom: 15 },
  ratingLabel: { fontSize: 14, color: '#636E72', marginBottom: 20 },
  submitBtn: { paddingVertical: 14, paddingHorizontal: 50, borderRadius: 30 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});