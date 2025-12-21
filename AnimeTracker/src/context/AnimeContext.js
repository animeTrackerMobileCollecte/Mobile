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

  const resetUserData = () => {
    setAnimeData(prevData => prevData.map(anime => ({
        ...anime,
        status: null,
        isInWishlist: false,
        isFavorite: false
    })));
    setGenreData([]);
    setScoreData(null);
  };

  const checkAuth = () => {
    if (!isAuthenticated && !token) { 
        Alert.alert(
            "Connexion requise", 
            "Tu dois être connecté pour modifier ta liste.",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Se connecter", onPress: () =>  navigation.navigate("Login") }
            ]
        );
        return false;
    }
    return true;
  };

  const fetchAnimesFromAPI = async () => {
    setLoading(true);
    try {
      const allRes = await client.get("/animeList");
      const allAnimes = allRes.data.data;

      let watchingIds = [];
      let completedIds = [];
      let wishlistIds = [];
      let favoriteIds = [];

      if (isAuthenticated && token) {
        try {
            const [watchRes, wishRes, completeRes, favRes] = await Promise.all([
                client.get("/lists/watchlist"),
                client.get("/lists/wishlist"),
                client.get("/lists/completed"),
                client.get("/lists/favorites")
            ]);

            watchingIds = watchRes.data.map((item) => String(item.animeId));
            wishlistIds = wishRes.data.map((item) => String(item.animeId));
            completedIds = completeRes.data.map((item) => String(item.animeId));
            favoriteIds = favRes.data.map((item) => String(item.animeId));
        } catch (error) {
            console.error(error);
        }
      }

      const mergedData = allAnimes.map((anime) => {
        const currentId = String(anime.malId);
        let userStatus = null; 
        let isInWishlist = false;

        if (watchingIds.includes(currentId)) userStatus = 'ongoing';
        else if (completedIds.includes(currentId)) userStatus = 'completed';
        else if (wishlistIds.includes(currentId)) {
            userStatus = 'wishlist';
            isInWishlist = true;
        }

        return {
          id: anime._id,
          malId: anime.malId,
          title: anime.title,
          image: anime.imageUrl, 
          imageUrl: anime.imageUrl, 
          rating: anime.jikanScore,
          episodes: anime.episodes,
          synopsis: anime.synopsis,
          title_japanese: anime.title_japanese,
          year: anime.year,
          studio: anime.studio,
          genres: anime.genres, 
          status: userStatus, 
          publicationStatus: anime.status, 
          isInWishlist: isInWishlist,
          isFavorite: favoriteIds.includes(currentId),
        };
      });

      setAnimeData(mergedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!isAuthenticated || !token) {
        setLoadingAnalytics(false);
        return;
    }
    setLoadingAnalytics(true);
    try {
      const [genresRes, scoresRes] = await Promise.all([
        client.get("/analysis/genres"), 
        client.get("/analysis/scores")
      ]);
      setGenreData(genresRes.data);
      setScoreData(scoresRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnimesFromAPI();
    fetchAnalytics(); 
  }, [token, isAuthenticated]); 

  const sendStatusUpdate = async (animeId, status, isFavorite = false) => {
    try {
        await client.post("/lists/status", { 
            animeId: animeId,
            listType: status,
            isFavorite: isFavorite
        });
        fetchAnalytics(); 
    } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "La sauvegarde a échoué.");
    }
  };

  const addToWishlist = async (malId) => {
    if (!checkAuth()) return;
    const anime = animeData.find((a) => a.malId === malId);
    if (!anime) {
        await sendStatusUpdate(malId, "WISHLIST");
        fetchAnimesFromAPI(); 
    } else {
        setAnimeData(prev => prev.map((a) => a.malId === malId ? { ...a, status: "wishlist", isInWishlist: true } : a));
        await sendStatusUpdate(malId, "WISHLIST");
    }
    Alert.alert("Ajouté !");
  };

  const removeFromWishlist = async (malId) => {
    if (!checkAuth()) return;
    setAnimeData(prev => prev.map((a) => a.malId === malId ? { ...a, status: null, isInWishlist: false } : a));
    Alert.alert("Retiré");
  };

  const startWatching = async (malId) => {
    if (!checkAuth()) return; 
    const anime = animeData.find((a) => a.malId === malId);
    setAnimeData(prev => prev.map((a) => a.malId === malId ? { ...a, status: "ongoing", isInWishlist: false } : a));
    await sendStatusUpdate(malId, "ONGOING");
    Alert.alert("Cool !", "Tu commences à regarder.");
  };

  const markAsCompleted = async (malId) => {
    if (!checkAuth()) return;
    const anime = animeData.find((a) => a.malId === malId);
    setAnimeData(prev => prev.map((a) => a.malId === malId ? { ...a, status: "completed", isInWishlist: false } : a));
    await sendStatusUpdate(malId, "COMPLETED");
    Alert.alert("Terminé !");
  };

const toggleFavorite = async (malId) => {
  if (!checkAuth()) return;
  
  const anime = animeData.find((a) => a.malId === malId);
  // Si l'anime n'est pas encore dans notre liste locale (search), on le traite
  const currentState = anime ? anime.isFavorite : false;
  const newState = !currentState;

  // 1. Mise à jour de l'état local (animeData)
  setAnimeData(prev => prev.map((a) => 
    a.malId === malId ? { ...a, isFavorite: newState } : a
  ));

  // 2. Envoi au serveur
  const currentStatus = anime?.status ? anime.status.toUpperCase() : "WISHLIST";
  await sendStatusUpdate(malId, currentStatus, newState);

  // 3. IMPORTANT : Relancer le fetch pour synchroniser l'UI partout
  // Ça va forcer le HomeScreen à voir que l'ID 20 est maintenant "Favorite"
  fetchAnimesFromAPI(); 
};

  const rateAnime = async (animeId, score) => {
    if (!checkAuth()) return;
    const scoreSur10 = score * 2;
    try {
        await client.post("/ratings", { animeId: animeId, score: scoreSur10 });
        setAnimeData(prev => prev.map(a => a.malId === animeId ? { ...a, personalScore: scoreSur10 } : a));
        fetchAnalytics(); 
        Alert.alert("Succès", "Ta note a été enregistrée !");
    } catch (error) {
        console.error(error);
        Alert.alert("Oups", "Impossible d'enregistrer la note.");
    }
  };

  return (
    <AnimeContext.Provider
      value={{
        animeData, loading, genreData, scoreData, loadingAnalytics,
        addToWishlist, removeFromWishlist, startWatching, toggleFavorite, markAsCompleted,
        fetchAnalytics, resetUserData, rateAnime
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) throw new Error("useAnime doit être utilisé dans AnimeProvider");
  return context;
};