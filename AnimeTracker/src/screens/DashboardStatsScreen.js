import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { PieChart, BarChart } from "react-native-gifted-charts";
import { useAnime } from "../context/AnimeContext";

export default function DashboardStatsScreen() {
  const { animeData, loading, genreData, loadingAnalytics } = useAnime();

  const safeAnimeData = Array.isArray(animeData) ? animeData : [];
  const safeGenreData = Array.isArray(genreData) ? genreData : [];
  const yearNow = new Date().getFullYear();


const genreChart = useMemo(() => {
  const normalized = safeGenreData
    .map((g) => {
      const name = g?.genre || g?.name || g?._id || "Unknown";
      const value = Number(g?.count ?? g?.value ?? g?.total ?? 0);
      return { name: String(name), value: Number.isFinite(value) ? value : 0 };
    })
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const total = safeAnimeData.filter((a) => {
    const s = (a?.status || "").toLowerCase();
    return s === "completed" || s === "ongoing";
  }).length;

  const palette = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffa94d", "#9e9e9e"];

  const pieData = normalized.map((x, idx) => ({
    label: x.name,
    value: x.value,
    color: palette[idx % palette.length],
  }));

  return { pieData, total };
}, [safeGenreData, safeAnimeData]);

  

  const statusCounts = useMemo(() => {
    const counts = { completed: 0, ongoing: 0, wishlist: 0 };

    safeAnimeData.forEach((a) => {
      const s = (a?.status || "").toLowerCase();
      if (s === "completed") counts.completed += 1;
      else if (s === "ongoing") counts.ongoing += 1;
      else if (s === "wishlist") counts.wishlist += 1;
      else if (a?.isInWishlist === true) counts.wishlist += 1; 
    });

    return counts;
  }, [safeAnimeData]);

  const totalStatus = statusCounts.completed + statusCounts.ongoing + statusCounts.wishlist;

  const statusChartData = useMemo(() => {
    const colors = {
      completed: "#22c55e",
      ongoing: "#3b82f6",
      wishlist: "#f59e0b",
    };

    return [
      { key: "completed", label: "Completed", value: statusCounts.completed, color: colors.completed },
      { key: "ongoing", label: "Ongoing", value: statusCounts.ongoing, color: colors.ongoing },
      { key: "wishlist", label: "Wishlist", value: statusCounts.wishlist, color: colors.wishlist },
    ].filter((x) => x.value > 0);
  }, [statusCounts]);


  

  const decadeBars = useMemo(() => {
    const ranges = [
      { label: "Avant 2000", min: 0, max: 1999 },
      { label: "2000-2009", min: 2000, max: 2009 },
      { label: "2010-2019", min: 2010, max: 2019 },
      { label: "2020+", min: 2020, max: 9999 },
    ];

    const watched = safeAnimeData.filter((a) => {
      const s = (a?.status || "").toLowerCase();
      return s === "completed" || s === "ongoing";
    });

    const counts = ranges.map((r) => ({ ...r, count: 0 }));

    watched.forEach((a) => {
      const y = Number(a?.year);
      if (!Number.isFinite(y) || y <= 0) return;
      const idx = counts.findIndex((r) => y >= r.min && y <= r.max);
      if (idx !== -1) counts[idx].count += 1;
    });

    return counts.map((r) => ({
      value: r.count,
      label: r.label.length > 7 ? r.label.slice(0, 7) + "…" : r.label,
      topLabelComponent: () =>
        r.count > 0 ? <Text style={styles.barTopLabel}>{r.count}</Text> : null,
    }));
  }, [safeAnimeData]);

  const totalDecade = decadeBars.reduce((acc, b) => acc + (b.value || 0), 0);

  

  const topRatedBars = useMemo(() => {
    const rated = safeAnimeData
      .filter((a) => {
        const ps = Number(a?.personalScore);
        return Number.isFinite(ps) && ps > 0;
      })
      .sort((a, b) => Number(b.personalScore) - Number(a.personalScore))
      .slice(0, 5);

    return rated.map((a) => {
      const title = String(a?.title || "Anime");
      const shortLabel = title.length > 8 ? title.slice(0, 8) + "…" : title;
      const val = Number(a.personalScore);

      return {
        value: val,
        label: shortLabel,
        frontColor: "#3b82f6",
        topLabelComponent: () => <Text style={styles.barTopLabel}>{val}</Text>,
      };
    });
  }, [safeAnimeData]);


  // UI

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.pageTitle}>Mes Analyses</Text>
      <Text style={styles.sectionLabel}>Basé uniquement sur vous</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mes Genres Préférés</Text>
            <Text style={styles.cardDescription}>
              Ce graphique analyse les animés de votre liste (en cours et terminés) pour montrer ce que vous regardez le plus souvent.
            </Text>

            {loadingAnalytics ? (
              <ActivityIndicator size="small" style={{ marginTop: 14 }} />
            ) : genreChart.total === 0 ? (
              <Text style={[styles.cardDescription, { marginTop: 14 }]}>
                Pas assez de données pour afficher ce graphique.
              </Text>
            ) : (
              <>
                <View style={{ alignItems: "center", marginTop: 14 }}>
                  <PieChart
                    data={genreChart.pieData.map((x) => ({ value: x.value, color: x.color }))}
                    donut
                    radius={130}
                    innerRadius={85}
                    showText={false}
                    centerLabelComponent={() => (
                      <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#111" }}>
                          {genreChart.total}
                        </Text>
                        <Text style={{ fontSize: 13, color: "gray", fontWeight: "500" }}>
                          Animes
                        </Text>
                      </View>
                    )}
                  />
                </View>

                <View style={styles.legendWrap}>
                  {genreChart.pieData.map((g) => (
                    <View key={g.label} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: g.color }]} />
                      <Text style={styles.legendText}>
                        {g.label}{" "}
                        <Text style={{ fontWeight: "bold", color: "#000" }}>({g.value})</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* STATUS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mes status cette année</Text>
            <Text style={styles.cardSubTitle}>Année {yearNow}</Text>

            {totalStatus === 0 ? (
              <Text style={styles.cardDescription}>
                Pas assez de données pour afficher ce graphique (aucun animé dans tes listes).
              </Text>
            ) : (
              <>
                <Text style={styles.cardDescription}>
                  Répartition de ta liste par status (completed / ongoing / wishlist).
                </Text>

                <View style={{ alignItems: "center", marginTop: 14 }}>
                  <PieChart
                    data={statusChartData.map((x) => ({ value: x.value, color: x.color }))}
                    donut
                    radius={130}
                    innerRadius={85}
                    showText={false}
                    centerLabelComponent={() => (
                      <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#111" }}>
                          {totalStatus}
                        </Text>
                        <Text style={{ fontSize: 13, color: "gray", fontWeight: "500" }}>
                          Animes
                        </Text>
                      </View>
                    )}
                  />
                </View>

                <View style={styles.legendWrap}>
                  {statusChartData.map((s) => (
                    <View key={s.key} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                      <Text style={styles.legendText}>
                        {s.label}{" "}
                        <Text style={{ fontWeight: "bold", color: "#000" }}>({s.value})</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Répartition des Animés par Décennie</Text>
            <Text style={styles.cardDescription}>
              Ce graphique utilise uniquement les animés en cours ou terminés (pas la wishlist).
            </Text>

            {totalDecade === 0 ? (
              <Text style={[styles.cardDescription, { marginTop: 14 }]}>
                Pas assez de données : aucun animé “en cours” ou “terminé” avec une année valide.
              </Text>
            ) : (
              <View style={{ marginTop: 14 }}>
                <BarChart
                  data={decadeBars}
                  barWidth={34}
                  spacing={18}
                  roundedTop
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisLabelTextStyle={{ fontSize: 12, color: "#555" }}
                  noOfSections={4}
                  frontColor="#22c55e"
                />
              </View>
            )}
          </View>

          {/* TOP RATED */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mes animés les mieux notés</Text>
            <Text style={styles.cardDescription}>
              Top 5 basé sur tes notes personnelles (personalScore).
            </Text>

            {topRatedBars.length === 0 ? (
              <Text style={[styles.cardDescription, { marginTop: 14 }]}>
                Pas de notes personnelles trouvées (personalScore).
              </Text>
            ) : (
              <View style={{ marginTop: 14 }}>
                <BarChart
                  data={topRatedBars}
                  barWidth={28}
                  spacing={18}
                  roundedTop
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisLabelTextStyle={{ fontSize: 12, color: "#555" }}
                  noOfSections={5}
                  maxValue={10}
                />
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 15, backgroundColor: "#fff" },
  pageTitle: { fontSize: 26, fontWeight: "bold" },
  sectionLabel: { fontSize: 18, marginTop: 18, marginBottom: 10, color: "gray" },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4, color: "#111" },
  cardSubTitle: { fontSize: 15, color: "gray", marginBottom: 10 },
  cardDescription: { fontSize: 14, color: "#666", lineHeight: 20 },

  legendWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 10, marginVertical: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 14, color: "#555" },

  barTopLabel: { fontSize: 12, fontWeight: "700", color: "#111" },
});
