import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList,Alert } from 'react-native';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard'; // NOUVEL IMPORT
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
// Import des dépendances internes
import { globalStyles, COLORS } from '../constants/styles';
import AnimeCard from '../components/AnimeCard';
import { MOCK_DATA_INITIAL } from '../data/mockData';

// Liste des onglets : DOIT correspondre aux champs de statut dans mockData
const TABS = ['Ongoing', 'Wishlist', 'Completed'];

// --- Composants Structurels (utilisent les styles externes) ---

import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useAuth();  

  return (
    <View style={globalStyles.header}>
      <Text style={globalStyles.headerTitle}>AnimeTracker</Text>

      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          if (!isAuthenticated) {
            navigation.navigate("Login");
          } else {
            //si il est connecter sa l'amène a la page setting ou il y a un bouton logout
            navigation.navigate("Settings"); 
          }
        }}
      >
        <Ionicons 
          name={isAuthenticated ? "person-circle" : "person-outline"} 
          size={28} 
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
};

const SearchBar = () => (
  <View style={globalStyles.searchContainer}>
    <Ionicons name="search" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />
    <TextInput placeholder="Search anime" style={globalStyles.searchInput} />
  </View>
);

// Composant des Onglets
const Tabs = ({ activeTab, setActiveTab }) => (
  <View style={globalStyles.tabsContainer}>
    {TABS.map((tabName) => (
      <TouchableOpacity
        key={tabName}
        style={[
          globalStyles.tabButton,
          activeTab === tabName ? globalStyles.activeTab : null,
        ]}
        onPress={() => setActiveTab(tabName)}
      >
        <Text
          style={activeTab === tabName ? globalStyles.activeTabText : globalStyles.inactiveTabText}
        >
          {tabName}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const StatsCards = ({ watchingCount, completedCount }) => (
  <View style={globalStyles.statsContainer}>
    <View style={[globalStyles.statCard, { backgroundColor: COLORS.primary }]}>
      <Text style={globalStyles.statNumber}>{watchingCount}</Text>
      <Text style={globalStyles.statLabel}>Watching</Text>
    </View>
    <View style={[globalStyles.statCard, { backgroundColor: COLORS.secondary }]}>
      <Text style={globalStyles.statNumber}>{completedCount}</Text>
      <Text style={globalStyles.statLabel}>Completed</Text>
    </View>
  </View>
);

// --- Écran Principal avec Logique ---

export default function HomeScreen() {
  
  // 1. Initialisation des états
  const [activeTab, setActiveTab] = useState(TABS[0]); // Onglet actif
  const [animeData, setAnimeData] = useState(MOCK_DATA_INITIAL); // Liste d'animés modifiable

  // 2. Fonction pour ajouter/retirer des favoris (Heart Button)
  const handleToggleFavorite = (id) => {
    // La fonction map() crée un nouveau tableau avec l'objet ciblé mis à jour
    const updatedData = animeData.map(anime => 
      anime.id === id 
        ? { ...anime, isFavorite: !anime.isFavorite } // Inverse la valeur isFavorite
        : anime 
    );
    
    // Met à jour l'état et force la liste à se redessiner
    setAnimeData(updatedData);
  };

  // 3. Fonction pour ajouter à la Wishlist (Swipe-to-action)
  const handleAddToWishlist = (id) => {
    const animeToAdd = animeData.find(anime => anime.id === id);

    if (animeToAdd && !animeToAdd.isInWishlist) {
      const updatedData = animeData.map(anime =>
        anime.id === id ? { ...anime, status: 'watchlist', isInWishlist: true } : anime
      );
      setAnimeData(updatedData);
      Alert.alert("Succès", `${animeToAdd.title} a été ajouté à votre Wishlist !`); // Pop-up simple
    } else if (animeToAdd && animeToAdd.isInWishlist) {
        Alert.alert("Info", `${animeToAdd.title} est déjà dans votre Wishlist.`);
    }
  };

 // 4. Logique de filtrage des animés
  const filteredAnime = animeData.filter((anime) => {
    if (activeTab === 'Favorites') {
        return anime.isFavorite === true;
    }
    if (activeTab === 'Wishlist') { // Nouveau filtre pour la wishlist
        return anime.status === 'watchlist' && anime.isInWishlist === true;
    }
    
    const targetStatus = activeTab.toLowerCase();
    return anime.status === targetStatus;
  });

  const watchingCount = animeData.filter(
      (anime) => anime.status === 'ongoing'
  ).length;

  // Compte des animés terminés (Completed)
  const completedCount = animeData.filter(
      (anime) => anime.status === 'completed'
  ).length;

  return (
    <View style={globalStyles.container}>
      
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <SearchBar />
        
        {/* Composant Tabs qui met à jour l'état */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} /> 
        
        {activeTab === 'Ongoing' && (
          <StatsCards 
              watchingCount={watchingCount} 
              completedCount={completedCount} 
          />
        )}

{/* Utilisation du NOUVEAU composant SwipeableAnimeCard */}
        <FlatList
          data={filteredAnime} 
          renderItem={({ item }) => (
            <SwipeableAnimeCard 
              item={item} 
              onToggleFavorite={handleToggleFavorite} 
              onAddToWishlist={handleAddToWishlist} // Passé pour le swipe
            />
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 50, color: COLORS.lightText }}>
              Aucun animé dans votre liste {activeTab}.
            </Text>
          )}
        />
        
        {/* Espace vide pour le menu du bas */}
        <View style={{ height: 80 }} /> 
      </ScrollView>
    </View>
  );
}