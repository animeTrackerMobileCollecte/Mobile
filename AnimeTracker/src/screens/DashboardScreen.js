
import { View, Text, ScrollView, StyleSheet } from "react-native";
import EpisodeDistributionChart from "../components/EpisodeDistributionChart";
import ScoreDistributionChart from "../components/ScoreDistributionChart";
import ScoreComparisonChart from "../components/ScoreComparisonChart";
import { useAnime } from "../context/AnimeContext";
import StudioChart from "../components/StudioChart";
import YearChart from "../components/YearChart";

export default function DashboardScreen() {
  const { animeData, genreData, scoreData, loadingAnalytics } = useAnime();

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Dashboard</Text>

      <EpisodeDistributionChart  data={animeData} />

      <ScoreDistributionChart data={animeData} />

     
            <YearChart data={animeData} />

            
            <StudioChart data={animeData} />

      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
