import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import client from "../api/Clients"; 
import { useAuth } from './AuthContext';
import { useNavigation } from "@react-navigation/native";

const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const navigation = useNavigation();
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreData, setGenreData] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const checkAuth = () => {
    if (!isAuthenticated && !token) { 
        Alert.alert(
            "Connexion requise", 
            "Tu dois être connecté pour modifier ta liste.",
            [{ text: "Annuler", style: "cancel" },
             { text: "Se connecter", onPress: () => navigation.navigate("Login") }]
        );
        return false;
    }
    return true;
  };
const resetUserData = () => {
  // On remet les listes à zéro pour le prochain utilisateur
  setAnimeData([]);
  setGenreData([]);
  setScoreData(null);
  console.log("Données utilisateur réinitialisées");
};
  const fetchAnimesFromAPI = async () => {
    setLoading(true);
    try {
      const allRes = await client.get("/animeList");
      const allAnimes = allRes.data.data;
      let watchIds = [], wishIds = [], compIds = [], favIds = [];

      if (isAuthenticated && token) {
        const [watch, wish, comp, fav] = await Promise.all([
            client.get("/lists/watchlist"),
            client.get("/lists/wishlist"),
            client.get("/lists/completed"),
            client.get("/lists/favorites")
        ]);
        watchIds = watch.data.map(i => String(i.animeId));
        wishIds = wish.data.map(i => String(i.animeId));
        compIds = comp.data.map(i => String(i.animeId));
        favIds = fav.data.map(i => String(i.animeId));
      }

      const merged = allAnimes.map(anime => {
        const curId = String(anime.malId);
        let status = null;
        if (watchIds.includes(curId)) status = 'ongoing';
        else if (compIds.includes(curId)) status = 'completed';
        else if (wishIds.includes(curId)) status = 'wishlist';

        return {
          ...anime,
          id: anime._id,
          status: status,
          isInWishlist: wishIds.includes(curId),
          isFavorite: favIds.includes(curId),
        };
      });
      setAnimeData(merged);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // LA FONCTION QUI CAUSAIT LE CRASH
  const sendStatusUpdate = async (animeId, status, isFavorite) => {
    const body = { animeId: parseInt(animeId), listType: status };
    if (typeof isFavorite === 'boolean') body.isFavorite = isFavorite;
    return await client.post('/lists/status', body);
  };

const startWatching = async (malId) => {
    if (!checkAuth()) return false; // Renvoie false si non connecté
    try {
      setAnimeData(prev => prev.map(a => a.malId === malId ? { ...a, status: "ongoing" } : a));
      await sendStatusUpdate(malId, "ONGOING");
      fetchAnimesFromAPI();
      return true; // <--- INDISPENSABLE
    } catch (e) { return false; }
  };

  const addToWishlist = async (malId) => {
    if (!checkAuth()) return false;
    try {
      await sendStatusUpdate(malId, "WISHLIST");
      fetchAnimesFromAPI();
      return true; // <--- INDISPENSABLE
    } catch (e) { return false; }
  };

const removeFromWishlist = async (anime) => {
  // 1. Extraction ultra-sécurisée de l'ID
  const idToUse = anime?.malId || anime?.id || anime;
  
  if (!idToUse) {
    Alert.alert("Erreur", "ID introuvable dans l'objet");
    return;
  }

  // 2. Suppression visuelle immédiate
  setAnimeData(prev => prev.filter(a => String(a.malId) !== String(idToUse)));

  try {
    // 3. Appel API avec forçage du type Nombre
    const response = await client.post('/lists/status', { 
      animeId: Number(idToUse), 
      listType: 'DROPPED' 
    });

    console.log("Réponse serveur:", response.data);
  } catch (error) {
    console.log("Détail erreur suppression:", error.response?.data);
    Alert.alert("Erreur Serveur", JSON.stringify(error.response?.data));
    fetchAnimesFromAPI(); // On recharge pour remettre l'item si ça a foiré
  }
};
  const markAsCompleted = async (malId) => {
    if (!checkAuth()) return;
    await sendStatusUpdate(malId, "COMPLETED");
    fetchAnimesFromAPI();
  };

  const toggleFavorite = async (malId) => {
    if (!checkAuth()) return;
    const anime = animeData.find(a => a.malId === malId);
    const newState = !anime?.isFavorite;
    await sendStatusUpdate(malId, anime?.status?.toUpperCase() || "WISHLIST", newState);
    fetchAnimesFromAPI();
  };

  useEffect(() => {
    fetchAnimesFromAPI();
  }, [token, isAuthenticated]);

  return (
    <AnimeContext.Provider value={{
        animeData, loading, genreData, scoreData,
        addToWishlist, removeFromWishlist, startWatching, 
        markAsCompleted, toggleFavorite, fetchAnimesFromAPI,resetUserData
    }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => useContext(AnimeContext);