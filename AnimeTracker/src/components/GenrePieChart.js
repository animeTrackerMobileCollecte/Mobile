import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function GenrePieChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA45B", "#9D9D9D", "#D4A5A5"];
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  const chartData = data.map((item, index) => ({
    value: item.count,
    color: colors[index % colors.length],
  }));

  return (
    <View
      style={{
        margin: 20,
        padding: 24, 
        backgroundColor: "#fff",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#2D3436", marginBottom: 8 }}>
          Mes Genres Préférés
        </Text>
        <Text style={{ fontSize: 14, color: "#636E72", lineHeight: 20 }}>
          Ce graphique analyse les animes de votre liste (en cours et terminés) pour montrer ce que vous regardez le plus souvent.
        </Text>
      </View>
      

      <View style={{ alignItems: "center" }}>
        <PieChart
          data={chartData}
          donut
          radius={120}
          innerRadius={80}
          innerCircleColor={"#fff"}
          showText={false}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: "#2D3436" }}>
                  {total}
                </Text>
                <Text style={{ fontSize: 13, color: "gray", fontWeight: "500" }}>Animes</Text>
              </View>
            );
          }}
        />
      </View>

      
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 25, justifyContent: "center" }}>
        {chartData.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 10,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: item.color,
                marginRight: 6,
              }}
            />
            <Text style={{ color: "#555", fontSize: 14 }}>
               {data[index]._id} <Text style={{ fontWeight: "bold", color: "#000" }}>({item.value})</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}