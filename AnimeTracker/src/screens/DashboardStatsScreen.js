import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { useAnime } from "../context/AnimeContext";

// Graphs existants (déjà utilisés dans Dashboard) (Pas besoin de recréer à nouveau)
import GenrePieChart from "../components/GenrePieChart";
import YearChart from "../components/YearChart";

// Nouveaux graphs
import StatusThisYearChart from "../components/StatusByYearChart";
import TopRatedChart from "../components/TopRatedChart";

export default function DashboardStatsScreen() {
  const { animeData, genreData, loadingAnalytics } = useAnime();

  // IMPORTANT:
  // - StatusThisYearChart a besoin d’objets qui contiennent listType + createdAt/updatedAt.
  //   Selon ton app, ces champs peuvent être dans animeData (si tu merges status + anime),
  //   ou dans une liste séparée. Ici on suppose que animeData contient listType + timestamps,
  //   sinon tu peux passer la vraie liste "statuses".
  const statuses = useMemo(() => {
    return Array.isArray(animeData) ? animeData : [];
  }, [animeData]);

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Mes analyses</Text>
      <Text style={{ fontSize: 22, color: "gray", marginTop: 10 }}>
        Basé uniquement sur mes informations
      </Text>

      {loadingAnalytics ? (
        <Text style={{ marginTop: 20, color: "#666" }}>
          Chargement des analyses...
        </Text>
      ) : (
        <>
          {/* 1) Mes Genres Préférés (le même graph que sur le dashboard actuel) */}
          <GenrePieChart data={genreData} />

          {/* 2) Status sur l’année courante (completed/ongoing/wishlist) */}
          <StatusThisYearChart statuses={statuses} />

          {/* 3) Tranches d’années vues (YearChart existant) */}
          <YearChart data={animeData} />

          {/* 4) Top animés les mieux notés */}
          <TopRatedChart animeData={animeData} />
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
