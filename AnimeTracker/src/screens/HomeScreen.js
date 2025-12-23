import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, COLORS } from "../constants/styles";
import { useAuth } from "../context/AuthContext";
import { useAnime } from "../context/AnimeContext";
import { useTheme } from "../context/ThemeContext"; 
import SwipeableAnimeCard from "../components/SwipeableAnimeCard";

const Header = ({ isAuthenticated, navigation, theme }) => (
  <View style={globalStyles.header}>
    <Text style={[globalStyles.headerTitle, { color: theme.text }]}>AnimeTracker</Text>
    <TouchableOpacity
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={() =>
        !isAuthenticated
          ? navigation.navigate("Login")
          : navigation.navigate("Settings")
      }
    >
      <Ionicons
        name={isAuthenticated ? "person-circle" : "person-outline"}
        size={28}
        color={theme.text} 
      />
    </TouchableOpacity>
  </View>
);

const Tabs = ({ activeTab, setActiveTab, theme }) => {
  const TABS = ["Tous", "Watchlist", "Wishlist", "Completed"];
  return (
    <View style={[globalStyles.tabsContainer, { backgroundColor: theme.background }]}>
      {TABS.map((tabName) => (
        <TouchableOpacity
          key={tabName}
          style={[
            globalStyles.tabButton,
            activeTab === tabName 
              ? globalStyles.activeTab 
              : { backgroundColor: theme.card } 
          ]}
          onPress={() => setActiveTab(tabName)}
        >
          <Text
            style={
              activeTab === tabName
                ? globalStyles.activeTabText
                : { color: theme.subText, fontSize: 13 }
            }
          >
            {tabName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const {
    animeData,
    addToWishlist,
    startWatching,
    markAsCompleted,
    toggleFavorite,
    removeFromWishlist, 
  } = useAnime();

 
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // États pour les données API
  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const BASE_URL = "https://animetracker-api.onrender.com/api/animeList";

  const loadAnimesFromAPI = async (searchText = "", page = 1, append = false) => {
    if (page > 1) setLoadingMore(true);
    else setIsSearching(true);

    try {
      const res = await fetch(
        `${BASE_URL}?page=${page}&limit=20&search=${searchText}`
      );
      if (!res.ok) throw new Error("Erreur réseau");

      const json = await res.json();
      const newData = json.data || [];

      if (append) {
        setAnimeList((prev) => [...prev, ...newData]);
      } else {
        setAnimeList(newData);
      }

      setHasMore(newData.length === 20);
      setCurrentPage(page);
    } catch (e) {
      console.log("Fetch error:", e.message);
    } finally {
      setIsSearching(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadAnimesFromAPI("", 1, false);
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setCurrentPage(1);
    setHasMore(true);

    if (activeTab === "Tous") {
      clearTimeout(window.searchTimer);
      window.searchTimer = setTimeout(() => {
        loadAnimesFromAPI(text, 1, false);
      }, 500);
    }
  };

  const handleLoadMore = () => {
    if (loadingMore || isSearching || !hasMore || activeTab !== "Tous") return;
    loadAnimesFromAPI(search, currentPage + 1, true);
  };

  const getFilteredData = () => {
    if (activeTab === "Tous") {
      return animeList.map((apiAnime) => {
        const isFav = animeData.some(
          (local) => local.malId === apiAnime.malId && local.isFavorite
        );
        return { ...apiAnime, isFavorite: isFav };
      });
    }

    let baseData = animeData || [];
    if (activeTab === "Watchlist") baseData = baseData.filter((a) => a.status === "ongoing");
    if (activeTab === "Wishlist") baseData = baseData.filter((a) => a.status === "wishlist" || a.isInWishlist === true);
    if (activeTab === "Completed") baseData = baseData.filter((a) => a.status === "completed");

    if (search.length > 0) {
      return baseData.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
    }
    return baseData;
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <Header isAuthenticated={isAuthenticated} navigation={navigation} theme={theme} />

      {/* BARRE DE RECHERCHE */}
      <View style={[globalStyles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Ionicons
          name="search"
          size={20}
          color={theme.subText}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder={
            activeTab === "Tous"
              ? "Chercher dans tout le catalogue..."
              : `Chercher dans ${activeTab}...`
          }
          placeholderTextColor={theme.subText}
          style={[globalStyles.searchInput, { flex: 1, color: theme.text }]}
          value={search}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {isSearching && activeTab === "Tous" && (
          <ActivityIndicator size="small" color={COLORS.primary} />
        )}
      </View>

      {/* ONGLETS */}
      <Tabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearch("");
          if (tab === "Tous" && animeList.length === 0)
            loadAnimesFromAPI("", 1, false);
        }}
        theme={theme}
      />

      {/* LISTE AVEC INFINITE SCROLL */}
      <FlatList
        data={getFilteredData()}
        keyExtractor={(item, index) =>
          item.malId?.toString() || item.id?.toString() || index.toString()
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : (
            <View style={{ height: 80 }} />
          )
        }
        renderItem={({ item }) => {
          const isAllTab = activeTab === "Tous";
          const isWishlistTab = activeTab === "Wishlist";
          const isWatchlistTab = activeTab === "Watchlist";

          return (
            <SwipeableAnimeCard
              item={item}
              onToggleFavorite={() => toggleFavorite(item.malId)}
              onAddToWishlist={isAllTab ? () => addToWishlist(item.malId) : undefined}
              onStartWatching={isAllTab || isWishlistTab ? () => startWatching(item.malId) : undefined}
              onMarkCompleted={isWatchlistTab ? () => markAsCompleted(item.malId) : undefined}
              onDelete={!isAllTab ? () => removeFromWishlist(item.malId) : undefined}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: theme.subText }}>
              {isSearching ? "Chargement..." : `Aucun animé trouvé`}
            </Text>
          </View>
        )}
      />
    </View>
  );
}