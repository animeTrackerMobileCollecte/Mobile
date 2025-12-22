import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardStyles, COLORS } from '../constants/styles';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function AnimeCard({ item, anime, onToggleFavorite }) {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? COLORS.dark : COLORS.light;
    
    const data = anime || item;
    if (!data) return null;

    const rating = data.rating || data.jikanScore || 0;

    return (
        <TouchableOpacity 
            style={[cardStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]} 
            onPress={() => navigation.navigate('AnimeDetails', { anime: data })}
            activeOpacity={0.8}
        >
            <Image source={{ uri: data.image || data.imageUrl }} style={cardStyles.cardImage} />

            <View style={cardStyles.cardContent}>
                <View style={cardStyles.cardHeader}>
                    <Text style={[cardStyles.animeTitle, { color: theme.text }]} numberOfLines={1}>
                        {data.title}
                    </Text>

                    <TouchableOpacity onPress={() => onToggleFavorite(data.malId || data.id)}>
                        <Ionicons
                            name="heart" 
                            size={22}
                            color={data.isFavorite ? COLORS.red : theme.subText}
                        />
                    </TouchableOpacity>
                </View>

                {/* Score Stars */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                            key={star}
                            name={star <= Math.round(rating / 2) ? "star" : "star-outline"}
                            size={14}
                            color={COLORS.star}
                        />
                    ))}
                    <Text style={{ marginLeft: 5, fontSize: 12, color: theme.subText, fontWeight: 'bold' }}>
                        {rating}
                    </Text>
                </View>

                <View style={cardStyles.cardFooter}>
                    <View style={[cardStyles.tagContainer, { backgroundColor: isDarkMode ? '#334155' : '#e0f2fe' }]}>
                        <Text style={[cardStyles.tagText, { color: isDarkMode ? '#60a5fa' : COLORS.primary }]}>
                            {data.status ? data.status.toUpperCase() : 'À DÉCOUVRIR'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: theme.subText }}>
                        {data.episodes ? `${data.episodes} EP` : '? EP'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}