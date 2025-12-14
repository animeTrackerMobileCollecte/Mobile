import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function EpisodeDistributionChart({ data }) {
  const ranges = [
    { label: "0–12", min: 0, max: 12 },
    { label: "13–24", min: 13, max: 24 },
    { label: "25–50", min: 25, max: 50 },
    { label: "51–100", min: 51, max: 100 },
    { label: "100+", min: 101, max: 9999 },
  ];

  const values = ranges.map((r) => ({
    label: r.label,
    value: data.filter(
      (a) => Number(a.episodes) >= r.min && Number(a.episodes) <= r.max
    ).length,
    frontColor: "#4C9BE8",
  }));

  return (
    <View
      style={{
        padding: 15,
        borderRadius: 12,
        backgroundColor: "white",
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Répartition des épisodes
      </Text>

      <BarChart
        data={values}
        barWidth={28}
        noOfSections={5}
        barBorderRadius={6}
        yAxisThickness={0}
        xAxisLabelTextStyle={{ fontSize: 12 }}
        showValuesAsTopLabel
        hideRules={false}
        spacing={20}
      />
    </View>
  );
}
