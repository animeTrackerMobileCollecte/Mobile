
import { View, Text, ScrollView, StyleSheet } from "react-native";
import EpisodeDistributionChart from "../components/EpisodeDistributionChart";
import ScoreDistributionChart from "../components/ScoreDistributionChart";
import GenrePieChart from "../components/GenrePieChart";
import ScoreComparisonChart from "../components/ScoreComparisonChart";
import { useAnime } from "../context/AnimeContext";

export default function DashboardScreen() {
  const { animeData, genreData, scoreData, loadingAnalytics } = useAnime();

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Dashboard</Text>

      <EpisodeDistributionChart  data={animeData} />

      <ScoreDistributionChart data={animeData} />

      
      <Text style={{ fontSize: 18, marginTop: 30, marginBottom: 10, color: 'gray' }}>
        Mes Analyses
      </Text>


      {loadingAnalytics ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <>
           
           <GenrePieChart data={genreData} />
           
           
           {scoreData && <ScoreComparisonChart data={scoreData} />}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
