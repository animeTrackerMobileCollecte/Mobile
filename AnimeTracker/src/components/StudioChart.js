import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function StudioChart({ data }) {
    if (!data || data.length === 0) {
        return <Text style={styles.message}>Aucune donnée d'anime à analyser.</Text>;
    }

    const studioCounts = data.reduce((acc, anime) => {
       
        const studioName = anime.studio || 'Inconnu'; 
        acc[studioName] = (acc[studioName] || 0) + 1;
        return acc;
    }, {});


    const sortedStudios = Object.entries(studioCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5);
    
    const values = sortedStudios.map(([studio, count]) => ({
        label: studio,
        value: count,
        frontColor: "#FF5733", 
    }));
    

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title}>
                Distribution par Studio (Top 5)
            </Text>

            <BarChart
                data={values}
                barWidth={28}
                noOfSections={5}
                barBorderRadius={6}
                yAxisThickness={0}
                
                xAxisLabelTextStyle={{ fontSize: 10, width: 60 }} 
                showValuesAsTopLabel
                hideRules={false}
                spacing={20}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: "white",
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    message: {
        textAlign: 'center',
        padding: 15,
    }
});