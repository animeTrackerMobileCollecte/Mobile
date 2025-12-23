import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";

// Composants Graphiques
import EpisodeDistributionChart from "../components/EpisodeDistributionChart";
import ScoreDistributionChart from "../components/ScoreDistributionChart";
import ScoreComparisonChart from "../components/ScoreComparisonChart";
import StudioChart from "../components/StudioChart";
import YearChart from "../components/YearChart";
// J'ai ajouté cet import car il était utilisé dans le code mais manquant en haut
import GenrePieChart from "../components/GenrePieChart"; 

import { useAnime } from "../context/AnimeContext";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../constants/styles";

export default function DashboardScreen() {
  const { animeData, genreData, scoreData, loadingAnalytics } = useAnime();
  
  // Récupération du thème
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Dashboard</Text>

      {/* Graphiques Généraux (Stats globales) */}
      <EpisodeDistributionChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      <ScoreDistributionChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      <YearChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      <StudioChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      {/* --- Section "Mes Analyses" (Fusionnée depuis HEAD) --- */}
      <Text style={[styles.sectionTitle, { color: theme.subText || theme.text }]}>
        Mes Analyses
      </Text>

      {loadingAnalytics ? (
        <ActivityIndicator 
          size="large" 
          color={COLORS.primary} 
          style={{ marginTop: 20 }} 
        />
      ) : (
        <>
           {/* On affiche le PieChart des genres */}
           <GenrePieChart data={genreData} theme={theme} isDarkMode={isDarkMode} />
           
           {/* On affiche la comparaison des scores si les données existent */}
           {scoreData && (
             <ScoreComparisonChart data={scoreData} theme={theme} isDarkMode={isDarkMode} />
           )}
        </>
      )}

      {/* Espace en bas pour le scroll */}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 15,
    fontWeight: "700",
  },
});