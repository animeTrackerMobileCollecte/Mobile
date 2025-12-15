import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function YearChart({ data }) {
    if (!data || data.length === 0) {
        return <Text style={styles.message}>Aucune donnée d'anime à analyser.</Text>;
    }

    
    const yearRanges = [
        { label: "Avant 2000", min: 0, max: 1999 },
        { label: "2000-2009", min: 2000, max: 2009 },
        { label: "2010-2019", min: 2010, max: 2019 },
        { label: "2020+", min: 2020, max: 9999 },
    ];

    const values = yearRanges.map((r) => ({
        label: r.label,
        value: data.filter(
       
            (a) => Number(a.year) >= r.min && Number(a.year) <= r.max
        ).length,
        frontColor: "#4CAF50", 
    }));

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title}>
                Répartition des Animes par Décennie
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