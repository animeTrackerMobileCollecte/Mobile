// src/components/SwipeableAnimeCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view'; // Import de la bibliothèque de swipe

import AnimeCard from './AnimeCard'; // Votre composant AnimeCard existant
import { COLORS } from '../constants/styles'; // Import des couleurs

const { width } = Dimensions.get('window'); // Pour calculer la taille du bouton de swipe

export default function SwipeableAnimeCard({ item, onToggleFavorite, onAddToWishlist, onDelete }) {

  // Ce composant est un simple wrapper pour le bouton "arrière" (back button) du swipe
  const HiddenItemWithActions = ({
    swipeAnimatedValue,
    rowActionAnimatedValue,
    rowMap,
    data,
    onAddToWishlist,
    onDelete,
  }) => (
    <View style={styles.rowBack}>
      {/* Bouton pour la Wishlist (à gauche) */}
      <TouchableOpacity
        style={[styles.backBtn, styles.backBtnLeft]}
        onPress={() => onAddToWishlist(data.item.id)}
      >
        <Ionicons name="bookmark-outline" size={25} color="white" />
        <Text style={styles.backBtnText}>Wishlist</Text>
      </TouchableOpacity>

      {/* Bouton de Suppression (à droite) - Exemple si vous voulez ajouter une suppression */}
       <TouchableOpacity
        style={[styles.backBtn, styles.backBtnRight]}
        onPress={() => onDelete(data.item.id)}
      >
        <Ionicons name="trash-outline" size={25} color="white" />
        <Text style={styles.backBtnText}>Supprimer</Text>
      </TouchableOpacity> 
    </View>
  );

  return (
    <SwipeListView
      disableRightSwipe={false} // Désactive le swipe vers la droite si vous ne voulez que le bouton Wishlist
      data={[item]} // SwipeListView attend un tableau, même pour un seul élément
      renderItem={({ item: anime }) => ( // Renvoie votre AnimeCard comme l'élément de devant
        <AnimeCard 
          item={anime} 
          onToggleFavorite={onToggleFavorite}
          // Si vous voulez que la carte elle-même soit cliquable pour les détails
          // onPress={() => navigation.navigate('Details', { animeId: anime.id })}
        />
      )}
      renderHiddenItem={(data, rowMap) => ( // Rend l'élément caché (le bouton Wishlist)
        <HiddenItemWithActions
          data={data}
          rowMap={rowMap}
          onAddToWishlist={onAddToWishlist}
          onDelete={onDelete} // Si vous avez un bouton supprimer
        />
      )}
      leftOpenValue={75} // La largeur du bouton caché (Wishlist)
      rightOpenValue={-75} // Pour un bouton à droite (suppression)
      previewRowKey={'0'} // Clé pour prévisualiser le swipe (optionnel)
      previewOpenValue={40} // Valeur d'ouverture pour la prévisualisation
      previewOpenDelay={1000} // Délai de la prévisualisation
    />
  );
}

const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    backgroundColor: COLORS.background, // Doit correspondre au background de la carte pour la transition
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderRadius: 16,
    marginBottom: 15, // Important pour l'alignement avec la carte
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75, // Largeur du bouton
    borderRadius: 16, // Arrondir les bords
  },
  backBtnLeft: {
    backgroundColor: COLORS.primary, // Couleur du bouton Wishlist
    left: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  backBtnRight: {
    backgroundColor: COLORS.red, // Couleur du bouton supprimer
    right: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  backBtnText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});