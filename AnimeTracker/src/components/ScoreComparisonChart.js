import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ScoreComparisonChart = ({ data }) => {
    
  
  if (!data || (data.myAverage === 0 && data.globalAverage === 0)) {
    return (<View style={styles.chartContainer}>
         <Text style={{ textAlign: 'center', color: '#666' }}>
            Note quelques animes pour voir ton profil comparé au reste du monde !
         </Text>
      </View>);
  }

  const chartData = {
    labels: ["Moi", "Monde"],
    datasets: [
      {
        data: [data.myAverage || 0, data.globalAverage || 0]
      }
    ]
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Comparatif des Notes</Text>
      <Text style={styles.subtitle}>Ma moyenne vs Moyenne Jikan</Text>
      <Text style={styles.description}>
        Ce graphique compare ta moyenne personnelle avec la moyenne mondiale des utilisateurs. 
        Il montre si tu as tendance à noter plus sévèrement ou plus généreusement que la communauté.
      </Text>
      
      <BarChart
        data={chartData}
        width={screenWidth - 60}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero={true}
        showValuesOnTopOfBars={true}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.7,
          decimalPlaces: 1,
        }}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    elevation: 3,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15
  },
  description: {
    fontSize: 13,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 20, 
    paddingHorizontal: 10,
    lineHeight: 18,
  }
});

export default ScoreComparisonChart;