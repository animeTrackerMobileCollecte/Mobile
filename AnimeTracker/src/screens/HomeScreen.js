import React from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Les données exactes de votre capture d'écran
const DATA = [
  {
    id: '1',
    title: 'Attack on Titan',
    rating: 5.0,
    episodes: 'Ep 15/24',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Demon Slayer',
    rating: 4.2,
    episodes: 'Ep 8/12',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    isFavorite: false,
  },
  {
    id: '3',
    title: 'One Piece',
    rating: 4.9,
    episodes: 'Ep 1024/--',
    image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
    isFavorite: true,
  },
  {
    id: '4',
    title: 'Jujutsu Kaisen',
    rating: 4.8,
    episodes: 'Ep 3/24',
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    isFavorite: false,
  },
];

export default function HomeScreen() {
  
  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons 
            key={star} 
            name={star <= Math.round(rating) ? "star" : "star-outline"} 
            size={14} 
            color="#FFD700" 
          />
        ))}
        <Text style={{ marginLeft: 5, fontSize: 12, color: '#666', fontWeight: 'bold' }}>{rating}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.animeTitle}>{item.title}</Text>
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={item.isFavorite ? "#E50914" : "#aaa"} 
          />
        </View>
        
        {renderStars(item.rating)}

        <View style={styles.cardFooter}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Ongoing</Text>
          </View>
          <Text style={styles.episodeText}>{item.episodes}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AnimeHub</Text>
        <TouchableOpacity style={styles.iconBtn}>
           <Ionicons name="notifications" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput placeholder="Search anime..." style={styles.searchInput} />
        </View>

        {/* TABS BUTTONS */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
            <Text style={styles.activeTabText}>Ongoing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.inactiveTabText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.inactiveTabText}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.inactiveTabText}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* STATS CARDS */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Watching</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#22c55e' }]}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* LISTE DES ANIMES */}
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} // On laisse le ScrollView global gérer le scroll
        />
        
        {/* Espace vide en bas pour ne pas être caché par le menu */}
        <View style={{ height: 80 }} /> 
      </ScrollView>
    </View>
  );
}

// STYLES IDENTIQUES À L'IMAGE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Pour éviter l'encoche du téléphone
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  iconBtn: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3b82f6', // Bleu
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  inactiveTabText: {
    color: '#888',
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Ombres légères
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 100,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-around',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  animeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Pour que le texte ne passe pas par dessus le cœur
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  tagContainer: {
    backgroundColor: '#e0f2fe', // Bleu très clair
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#3b82f6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  episodeText: {
    fontSize: 12,
    color: '#888',
  }
});