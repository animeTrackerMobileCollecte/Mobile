import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardStyles, COLORS } from '../constants/styles';

// Fonction interne pour afficher les étoiles
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

export default function AnimeCard({ item, onToggleFavorite }) {
  return (
    <View style={cardStyles.card}>
      {/* Colonne 1 : Image */}
      <Image source={{ uri: item.image }} style={cardStyles.cardImage} />
      
      {/* Colonne 2 : Contenu */}
      <View style={cardStyles.cardContent}>
        
        {/* Ligne 1 : Titre et Cœur */}
        <View style={cardStyles.cardHeader}>
          <Text style={cardStyles.animeTitle}>{item.title}</Text>
          
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)}> 
            <Ionicons 
              name={item.isFavorite ? "heart" : "heart"} // Le cœur actif est rempli
              size={20} 
              color={item.isFavorite ? COLORS.red : COLORS.lightText} 
              // L'icône outline est gérée par la couleur ici (red ou lightText)
            />
          </TouchableOpacity>
        </View>
        
        {renderStars(item.rating)}

        {/* Ligne 3 : Tag et Épisodes */}
        <View style={cardStyles.cardFooter}>
          <View style={cardStyles.tagContainer}>
            <Text style={cardStyles.tagText}>
              {item.status.toUpperCase()} 
            </Text>
          </View>
          <Text style={cardStyles.episodeText}>{item.episodes}</Text>
        </View>
      </View>
    </View>
  );
}