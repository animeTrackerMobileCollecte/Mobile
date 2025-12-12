import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { globalStyles, COLORS } from '../constants/styles';
import AnimeCard from '../components/AnimeCard';
import { useAnime } from '../context/AnimeContext';

// Liste des onglets : DOIT correspondre aux champs de statut dans mockData
const TABS = ['Tous', 'Watchlist', 'Wishlist', 'Completed'];

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
  // On utilise le context global
  const { animeData, addToWishlist, startWatching, markAsCompleted, toggleFavorite } = useAnime();

  // Onglet actif (local à cet écran)
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Logique de filtrage des animés
  const filteredAnime = animeData.filter((anime) => {
    // Onglet "Tous" affiche tous les animés
    if (activeTab === 'Tous') {
      return true;
    }
    if (activeTab === 'Favorites') {
      return anime.isFavorite === true;
    }
    // Watchlist dans Home affiche les animés "ongoing" (en cours)
    if (activeTab === 'Watchlist') {
      return anime.status === 'ongoing';
    }
    // Wishlist affiche les animés à regarder plus tard
    if (activeTab === 'Wishlist') {
      return anime.status === 'wishlist' && anime.isInWishlist === true;
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

        {activeTab === 'Watchlist' && (
          <StatsCards
            watchingCount={watchingCount}
            completedCount={completedCount}
          />
        )}

        <FlatList
          data={filteredAnime}
          renderItem={({ item }) => (
            <SwipeableAnimeCard
              item={item}
              onToggleFavorite={toggleFavorite}
              onAddToWishlist={activeTab === 'Tous' ? addToWishlist : undefined}
              onStartWatching={activeTab === 'Tous' || activeTab === 'Wishlist' ? startWatching : undefined}
              onMarkCompleted={activeTab === 'Watchlist' ? markAsCompleted : undefined}
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