import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardStyles, COLORS } from '../constants/styles';
import { useNavigation } from "@react-navigation/native";


const renderStars = (rating) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(rating) ? "star" : "star-outline"}
          size={14}
          color={COLORS.star}
        />
      ))}
      <Text style={{ marginLeft: 5, fontSize: 12, color: COLORS.lightText, fontWeight: 'bold' }}>
        {rating}
      </Text>
    </View>
  );
};


export default function AnimeCard({ item, anime, onToggleFavorite }) {
  const navigation = useNavigation();
  const data = anime || item;
  if (!data) return null;

  return (
    <TouchableOpacity 
        style={cardStyles.card} 
        onPress={() => navigation.navigate('AnimeDetails', { anime: data })}
        activeOpacity={0.9}
    >
      <Image source={{ uri: data.image || data.imageUrl }} style={cardStyles.cardImage} />

      
      <View style={cardStyles.cardContent}>

        
        <View style={cardStyles.cardHeader}>
          <Text style={cardStyles.animeTitle} numberOfLines={1}>{data.title}</Text>

          <TouchableOpacity onPress={() => onToggleFavorite(data.id)}>
            <Ionicons
              name={data.isFavorite ? "heart" : "heart"} 
              size={20}
              color={data.isFavorite ? COLORS.red : COLORS.lightText}
            />
          </TouchableOpacity>
        </View>

        
        {renderStars(data.rating || data.jikanScore || 0)}

        
        <View style={cardStyles.cardFooter}>
          <View style={cardStyles.tagContainer}>
            <Text style={cardStyles.tagText}>
              {data.status ? data.status.toUpperCase() : 'À DÉCOUVRIR'}
            </Text>
          </View>
          <Text style={cardStyles.episodeText}>
             {data.episodes ? `${data.episodes} EP` : '? EP'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}