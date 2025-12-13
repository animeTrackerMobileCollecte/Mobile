import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import SwipeableAnimeCard from "../components/SwipeableAnimeCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, COLORS } from "../constants/styles";
import { useAnime } from "../context/AnimeContext";
import { useAuth } from "../context/AuthContext";

// Onglets disponibles
const TABS = ["Tous", "Watchlist", "Wishlist", "Completed"];

// ---------------- HEADER ----------------

const Header = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  return (
    <View style={globalStyles.header}>
      <Text style={globalStyles.headerTitle}>AnimeTracker</Text>

      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          if (!isAuthenticated) navigation.navigate("Login");
          else navigation.navigate("Settings");
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

// ---------------- SEARCH BAR ----------------

const SearchBar = () => (
  <View style={globalStyles.searchContainer}>
    <Ionicons name="search" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />
    <TextInput placeholder="Search anime" style={globalStyles.searchInput} />
  </View>
);

// ---------------- TABS ----------------

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
          style={
            activeTab === tabName
              ? globalStyles.activeTabText
              : globalStyles.inactiveTabText
          }
        >
          {tabName}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ---------------- STATS CARDS ----------------

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

// ---------------- MAIN SCREEN ----------------

export default function HomeScreen() {
  const {
    animeData,
    loading,
    addToWishlist,
    startWatching,
    markAsCompleted,
    toggleFavorite,
  } = useAnime();

  const [activeTab, setActiveTab] = useState(TABS[0]);

  // ---------------- LOADING SCREEN ----------------

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10 }}>Chargement des animés…</Text>
      </View>
    );
  }

  // ---------------- FILTERING ----------------

  const filteredAnime = animeData.filter((anime) => {
    if (activeTab === "Tous") return true;
    if (activeTab === "Favorites") return anime.isFavorite;
    if (activeTab === "Watchlist") return anime.status === "ongoing";
    if (activeTab === "Wishlist") return anime.status === "wishlist";
    if (activeTab === "Completed") return anime.status === "completed";
    return true;
  });

  const watchingCount = animeData.filter((a) => a.status === "ongoing").length;
  const completedCount = animeData.filter((a) => a.status === "completed").length;

  // ---------------- RETURN UI ----------------

  return (
    <View style={globalStyles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Watchlist" && (
          <StatsCards watchingCount={watchingCount} completedCount={completedCount} />
        )}

        <FlatList
          data={filteredAnime}
          renderItem={({ item }) => (
            <SwipeableAnimeCard
              item={item}
              onToggleFavorite={toggleFavorite}
              onAddToWishlist={activeTab === "Tous" ? addToWishlist : undefined}
              onStartWatching={
                activeTab === "Tous" || activeTab === "Wishlist"
                  ? startWatching
                  : undefined
              }
              onMarkCompleted={
                activeTab === "Watchlist" ? markAsCompleted : undefined
              }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", marginTop: 50, color: COLORS.lightText }}>
              Aucun animé dans votre liste {activeTab}.
            </Text>
          )}
        />

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
