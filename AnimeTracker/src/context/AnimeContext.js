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
    console.log("Nettoyage des données utilisateur...");
    setAnimeData(prevData => prevData.map(anime => ({
        ...anime,
        status: null,
        isInWishlist: false,
        isFavorite: false
    })));
    setGenreData([]);
    setScoreData(null);
  };

  // --- SÉCURITÉ ---
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

  // --- CHARGEMENT INTELLIGENT ---
  const fetchAnimesFromAPI = async () => {
    setLoading(true);
    try {
      // 1. On récupère TOUJOURS le catalogue public
      const allRes = await client.get("/animeList");
      const allAnimes = allRes.data.data;

      // 2. On prépare les listes (Vides par défaut pour l'Invité)
      let watchingIds = [];
      let completedIds = [];
      let wishlistIds = [];
      let favoriteIds = [];

      // 3. SI Connecté : On remplit les listes avec les données du serveur
      if (isAuthenticated && token) {
        console.log(" Mode Connecté : Récupération des listes...");
        try {
            const [watchRes, wishRes, completeRes, favRes] = await Promise.all([
                client.get("/lists/watchlist"),
                client.get("/lists/wishlist"),
                client.get("/lists/completed"),
                client.get("/lists/favorites")
            ]);

            // Conversion en Strings pour faciliter la comparaison
            watchingIds = watchRes.data.map((item) => String(item.animeId));
            wishlistIds = wishRes.data.map((item) => String(item.animeId));
            completedIds = completeRes.data.map((item) => String(item.animeId));
            favoriteIds = favRes.data.map((item) => String(item.animeId));
        } catch (error) {
            console.error("Erreur récupération listes perso", error);
        }
      } else {
          console.log(" Mode Invité : Listes vides par défaut");
      }

      // 4. La Fusion (Mapping Unique pour tout le monde)
      const mergedData = allAnimes.map((anime) => {
        const currentId = String(anime.malId);

        // --- Logique du Statut Utilisateur ---
        let userStatus = null; 
        let isInWishlist = false;

        if (watchingIds.includes(currentId)) userStatus = 'ongoing';
        else if (completedIds.includes(currentId)) userStatus = 'completed';
        else if (wishlistIds.includes(currentId)) {
            userStatus = 'wishlist';
            isInWishlist = true;
        }

        const isFav = favoriteIds.includes(currentId);

        
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
          isFavorite: isFav,
        };
      });

      setAnimeData(mergedData);

    } catch (err) {
      console.error(" Erreur chargement global:", err);
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
      console.log("Erreur API Analytics:", err);
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
        console.log(`Backend mis à jour : ${status}`);
        
        fetchAnalytics(); 

    } catch (error) {
        console.error("Erreur sauvegarde:", error.response ? error.response.data : error.message);
        Alert.alert("Erreur", "La sauvegarde a échoué.");
    }
  };

  // --- ACTIONS UTILISATEUR ---
  const addToWishlist = async (id) => {
    if (!checkAuth()) return;
    const anime = animeData.find((a) => a.id === id);
    if (anime && !anime.isInWishlist) {
      setAnimeData(animeData.map((a) => a.id === id ? { ...a, status: "wishlist", isInWishlist: true } : a));
      await sendStatusUpdate(anime.malId, "WISHLIST");
      Alert.alert("Ajouté !", `${anime.title} ajouté à la wishlist`);
    }
  };

  const removeFromWishlist = async (id) => {
    if (!checkAuth()) return;
    const anime = animeData.find((a) => a.id === id);
    setAnimeData(animeData.map((a) => a.id === id ? { ...a, isInWishlist: false } : a));
    Alert.alert("Retiré", `${anime?.title} retiré`);
  };

  const startWatching = async (id) => {
    if (!checkAuth()) return; 
    const anime = animeData.find((a) => a.id === id);
    setAnimeData(animeData.map((a) => a.id === id ? { ...a, status: "ongoing", isInWishlist: false } : a));
    await sendStatusUpdate(anime.malId, "ONGOING");
    Alert.alert("Cool !", `Tu commences ${anime?.title} !`);
  };

  const markAsCompleted = async (id) => {
    if (!checkAuth()) return;
    const anime = animeData.find((a) => a.id === id);
    setAnimeData(animeData.map((a) => a.id === id ? { ...a, status: "completed" } : a));
    await sendStatusUpdate(anime.malId, "COMPLETED");
    Alert.alert("Terminé !", `${anime?.title} marqué comme terminé !`);
  };

  const toggleFavorite = async (id) => {
    if (!checkAuth()) return;
    const anime = animeData.find((a) => a.id === id);
    const newState = !anime.isFavorite;
    setAnimeData(animeData.map((a) => a.id === id ? { ...a, isFavorite: newState } : a));
  };

  const rateAnime = async (animeId, score) => {
    if (!checkAuth()) return;
    const scoreSur10 = score * 2;

    try {
        await client.post("/ratings", { 
            animeId: animeId,
            score: scoreSur10 
        });
        
        console.log(` Note envoyée : ${score}/5 pour l'anime ${animeId}`);
        
        
        setAnimeData(prev => prev.map(a => 
            a.malId === animeId ? { ...a, personalScore: scoreSur10 } : a
        ));

        fetchAnalytics(); 
        
        Alert.alert("Succès", "Ta note a été enregistrée !");

    } catch (error) {
        console.error(" Erreur notation:", error);
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