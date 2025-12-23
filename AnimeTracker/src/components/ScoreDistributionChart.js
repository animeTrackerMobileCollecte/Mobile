import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { COLORS } from "../constants/styles";

const { width } = Dimensions.get("window");

export default function ScoreDistributionChart({ data, theme, isDarkMode }) {
  
  
  const chartData = useMemo(() => {
    
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let hasData = false;

    
    if (Array.isArray(data)) {
      data.forEach((anime) => {
        const score = Number(anime.personalScore);

        
        if (score >= 1 && score <= 5) {
          counts[score] += 1;
          hasData = true;
        }
      });
    }

    
    const formattedData = [
      { label: "1★", value: counts[1], frontColor: "#ef4444" }, 
      { label: "2★", value: counts[2], frontColor: "#f97316" }, 
      { label: "3★", value: counts[3], frontColor: "#eab308" }, 
      { label: "4★", value: counts[4], frontColor: "#84cc16" }, 
      { label: "5★", value: counts[5], frontColor: "#22c55e" }, 
    ];

    
    return {
      data: formattedData.map(item => ({
        ...item,
        topLabelComponent: () => (
          item.value > 0 ? (
            <Text style={{ color: theme.text, fontSize: 10, marginBottom: 4 }}>
              {item.value}
            </Text>
          ) : null
        )
      })),
      hasData
    };
  }, [data, theme]);

  

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        Répartition de mes notes
      </Text>
      
      <Text style={[styles.cardSubtitle, { color: theme.subText }]}>
        Comment je note mes animés (1 à 5 étoiles)
      </Text>

      {!chartData.hasData ? (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: theme.subText }]}>
            Aucune note enregistrée pour le moment.
          </Text>
          <Text style={{ color: theme.subText, fontSize: 12, marginTop: 5 }}>
            Allez sur la page d'un animé pour lui donner une note !
          </Text>
        </View>
      ) : (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <BarChart
            data={chartData.data}
            barWidth={35}
            noOfSections={4}
            barBorderRadius={4}
            frontColor={COLORS.primary}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={theme.border}
            yAxisTextStyle={{ color: theme.subText, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.text, fontSize: 12 }}
            height={180}
            width={width - 80} 
            isAnimated
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 15,
    borderWidth: 1,
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});