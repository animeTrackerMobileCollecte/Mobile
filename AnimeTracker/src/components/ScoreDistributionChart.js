import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function ScoreDistributionChart({ data }) {
  const buckets = [
    { label: "8–10", min: 8, max: 10, color: "#4CAF50" },
    { label: "7–8", min: 7, max: 7.99, color: "#FFC107" },
    { label: "6–7", min: 6, max: 6.99, color: "#FF7043" },
    { label: "<6", min: 0, max: 5.99, color: "#E57373" },
  ];

  const chartData = buckets.map((b) => ({
    value: data.filter(
      (a) => Number(a.rating) >= b.min && Number(a.rating) <= b.max
    ).length,
    color: b.color,
    text: b.label,
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
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Répartition des notes
      </Text>

      <PieChart
        data={chartData}
        donut
        radius={100}
        innerRadius={60}
        showText
        textColor="#000"
        textSize={11}
        strokeColor="#fff"
        strokeWidth={2}
      />

      {/* Légende */}
      <View style={{ marginTop: 15 }}>
        {chartData.map((item) => (
          <View
            key={item.text}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                backgroundColor: item.color,
                marginRight: 8,
                borderRadius: 4,
              }}
            />
            <Text style={{ fontSize: 14 }}>{item.text} ({item.value})</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
