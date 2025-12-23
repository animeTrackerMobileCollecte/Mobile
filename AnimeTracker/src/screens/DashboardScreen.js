import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";


import EpisodeDistributionChart from "../components/EpisodeDistributionChart";
import ScoreDistributionChart from "../components/ScoreDistributionChart";
import ScoreComparisonChart from "../components/ScoreComparisonChart";
import StudioChart from "../components/StudioChart";
import YearChart from "../components/YearChart";
import GenrePieChart from "../components/GenrePieChart"; 

import { useAnime } from "../context/AnimeContext";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../constants/styles";

export default function DashboardScreen() {
  const { animeData, genreData, scoreData, loadingAnalytics } = useAnime();
  
  
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Dashboard</Text>

      <EpisodeDistributionChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      <ScoreDistributionChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      <YearChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      <StudioChart data={animeData} theme={theme} isDarkMode={isDarkMode} />

      
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
           
           <GenrePieChart data={genreData} theme={theme} isDarkMode={isDarkMode} />
           
          
           {scoreData && (
             <ScoreComparisonChart data={scoreData} theme={theme} isDarkMode={isDarkMode} />
           )}
        </>
      )}

     
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