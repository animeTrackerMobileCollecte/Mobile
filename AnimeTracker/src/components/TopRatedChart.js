import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function TopRatedChart({ animeData }) {
    const top = useMemo(() => {
        const arr = Array.isArray(animeData) ? animeData : [];

       
        const scored = arr
        .map((a) => {
            const rating =
            toNumber(a?.rating) ??
            toNumber(a?.myRating) ??
            toNumber(a?.userRating) ??
            toNumber(a?.score) ??
            toNumber(a?.personalScore);

            const title = a?.title ?? a?.name ?? a?.animeTitle ?? "Anime";
            return { title, rating };
        })
        .filter((x) => x.rating !== null && x.rating > 0);

        scored.sort((a, b) => b.rating - a.rating);

        // Top 5
        return scored.slice(0, 5);
    }, [animeData]);

    if (!top.length) {
        return (
        <View style={styles.card}>
            <Text style={styles.title}>Mes animés les mieux notés</Text>
            <Text style={styles.description}>
            Ajoute des notes à tes animés pour afficher ton Top 5.
            </Text>
        </View>
        );
    }

    const data = top.map((x) => ({
        value: x.rating,
        label: x.title.length > 12 ? x.title.slice(0, 12) + "…" : x.title,
        frontColor: "#3b82f6",
    }));

    return (
        <View style={styles.card}>
        <Text style={styles.title}>Mes animés les mieux notés</Text>
        <Text style={styles.description}>
            Top 5 basé sur tes notes personnelles (plus la barre est haute, plus tu as aimé).
        </Text>

        <BarChart
            data={data}
            barWidth={34}
            spacing={18}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={1}
            yAxisThickness={0}
            yAxisTextStyle={{ color: "#666" }}
            xAxisLabelTextStyle={{ color: "#444", fontSize: 11 }}
            noOfSections={4}
            maxValue={Math.max(...data.map((d) => d.value), 1)}
            height={240}
        />

        <View style={{ marginTop: 10 }}>
            {top.map((x, idx) => (
            <Text key={idx} style={styles.rankLine}>
                {idx + 1}. {x.title} — <Text style={styles.rankStrong}>{x.rating}</Text>
            </Text>
            ))}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 16,
        padding: 18,
    },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    description: {
        fontSize: 13,
        color: "#636E72",
        marginBottom: 14,
        lineHeight: 18,
    },
    rankLine: { color: "#444", marginTop: 2 },
    rankStrong: { fontWeight: "bold", color: "#000" },
});
