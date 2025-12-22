import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const normalizeListType = (v) => {
  if (!v) return null;
  const s = String(v).toUpperCase();
  if (s.includes("COMP")) return "COMPLETED";
  if (s.includes("ONGO")) return "ONGOING";
  if (s.includes("WISH")) return "WISHLIST";
  return s;
};

const getYear = (d) => {
  try {
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  } catch {
    return null;
  }
};

export default function StatusThisYearChart({ statuses }) {
    const { completed, ongoing, wishlist, currentYear } = useMemo(() => {
        const year = new Date().getFullYear();

        let c = 0, o = 0, w = 0;

        (Array.isArray(statuses) ? statuses : []).forEach((s) => {
        const listType = normalizeListType(s?.listType ?? s?.status);
        const y = getYear(s?.updatedAt ?? s?.createdAt);

        if (y !== year) return;

        if (listType === "COMPLETED") c += 1;
        if (listType === "ONGOING") o += 1;
        if (listType === "WISHLIST") w += 1;
        });

        return { completed: c, ongoing: o, wishlist: w, currentYear: year };
    }, [statuses]);

    const total = completed + ongoing + wishlist;

    if (total === 0) {
        return (
        <View style={styles.card}>
            <Text style={styles.title}>Mes statuts cette année</Text>
            <Text style={styles.subtitle}>Année {currentYear}</Text>
            <Text style={styles.empty}>
            Pas assez de données pour afficher ce graphique (aucune mise à jour de liste cette année).
            </Text>
        </View>
        );
    }

    const data = [
        { value: completed, label: "Completed", frontColor: "#4ECDC4" },
        { value: ongoing, label: "Ongoing", frontColor: "#45B7D1" },
        { value: wishlist, label: "Wishlist", frontColor: "#FF6B6B" },
    ];

    return (
        <View style={styles.card}>
        <Text style={styles.title}>Mes statuts cette année</Text>
        <Text style={styles.subtitle}>Année {currentYear}</Text>
        <Text style={styles.description}>
            Ce graphique montre combien d’animés tu as terminés, commencés (en cours) ou ajoutés à ta wishlist cette année.
        </Text>

        <BarChart
            data={data}
            barWidth={42}
            spacing={22}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={1}
            yAxisThickness={0}
            yAxisTextStyle={{ color: "#666" }}
            xAxisLabelTextStyle={{ color: "#444", fontSize: 12 }}
            noOfSections={4}
            maxValue={Math.max(...data.map((d) => d.value), 1)}
            height={220}
        />

        <View style={{ marginTop: 10 }}>
            <Text style={styles.legendLine}>Completed: <Text style={styles.legendStrong}>{completed}</Text></Text>
            <Text style={styles.legendLine}>Ongoing: <Text style={styles.legendStrong}>{ongoing}</Text></Text>
            <Text style={styles.legendLine}>Wishlist: <Text style={styles.legendStrong}>{wishlist}</Text></Text>
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
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
    subtitle: { fontSize: 13, color: "#666", marginBottom: 10 },
    description: {
        fontSize: 13,
        color: "#636E72",
        marginBottom: 14,
        lineHeight: 18,
    },
    empty: { textAlign: "center", color: "#666", paddingVertical: 14 },
    legendLine: { color: "#444", marginTop: 2 },
    legendStrong: { fontWeight: "bold", color: "#000" },
});
