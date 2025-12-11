
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

import AnimeCard from './AnimeCard';
import { COLORS } from '../constants/styles';

export default function SwipeableAnimeCard({ item, onToggleFavorite, onAddToWishlist, onStartWatching, onMarkCompleted, onDelete }) {


  const HiddenItemWithActions = ({
    swipeAnimatedValue,
    rowActionAnimatedValue,
    rowMap,
    data,
    onAddToWishlist,
    onStartWatching,
    onMarkCompleted,
    onDelete,
  }) => (
    <View style={styles.rowBack}>

      {onMarkCompleted ? (

        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnLeft]}
          onPress={() => onMarkCompleted(data.item.id)}
        >
          <Ionicons name="checkmark-circle-outline" size={25} color="white" />
          <Text style={styles.backBtnText}>Terminé</Text>
        </TouchableOpacity>
      ) : onStartWatching ? (

        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnLeft]}
          onPress={() => onStartWatching(data.item.id)}
        >
          <Ionicons name="play-circle-outline" size={25} color="white" />
          <Text style={styles.backBtnText}>Commencer</Text>
        </TouchableOpacity>
      ) : null}


      {(onStartWatching && onAddToWishlist) ? (

        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnRight]}
          onPress={() => onAddToWishlist(data.item.id)}
        >
          <Ionicons name="bookmark-outline" size={25} color="white" />
          <Text style={styles.backBtnText}>Wishlist</Text>
        </TouchableOpacity>
      ) : onDelete ? (

        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnRight]}
          onPress={() => onDelete(data.item.id)}
        >
          <Ionicons name="trash-outline" size={25} color="white" />
          <Text style={styles.backBtnText}>Supprimer</Text>
        </TouchableOpacity>
      ) : null}
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
      renderHiddenItem={(data, rowMap) => (
        <HiddenItemWithActions
          data={data}
          rowMap={rowMap}
          onAddToWishlist={onAddToWishlist}
          onStartWatching={onStartWatching}
          onMarkCompleted={onMarkCompleted}
          onDelete={onDelete}
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
    backgroundColor: COLORS.background,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderRadius: 16,
    marginBottom: 15,
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    borderRadius: 16,
  },
  backBtnLeft: {
    backgroundColor: COLORS.primary,
    left: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  backBtnRight: {
    backgroundColor: COLORS.red,
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