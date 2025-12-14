
import { View, Text, ScrollView, StyleSheet } from "react-native";
import EpisodeDistributionChart from "../components/EpisodeDistributionChart";
import ScoreDistributionChart from "../components/ScoreDistributionChart";
import { useAnime } from "../context/AnimeContext";

export default function DashboardScreen() {
  const { animeData } = useAnime();

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Dashboard</Text>

      <EpisodeDistributionChart  data={animeData} />

      <ScoreDistributionChart data={animeData} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
