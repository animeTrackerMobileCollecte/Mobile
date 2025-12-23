import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import client from "../api/Clients"; 
import { useAuth } from './AuthContext';
import { useNavigation } from "@react-navigation/native";

const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const navigation = useNavigation();
  
  // États de base
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les graphiques (Analyses)
  const [genreData, setGenreData] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Vérification de connexion
  const checkAuth = () => {
    if (!isAuthenticated && !token) { 
        Alert.alert(
            "Connexion requise", 
            "Tu dois être connecté pour effectuer cette action.",
            [{ text: "Annuler", style: "cancel" },
             { text: "Se connecter", onPress: () => navigation.navigate("Login") }]
        );
        return false;
    }
    return true;
  };

  const resetUserData = () => {
    setAnimeData([]);
    setGenreData([]);
    setScoreData(null);
    console.log("Données utilisateur réinitialisées");
  };

  // --- FONCTION DE CHARGEMENT PRINCIPALE ---
  const fetchAnimesFromAPI = async () => {
    setLoading(true);
    if (isAuthenticated) setLoadingAnalytics(true);

    try {
      // 1. Récupérer la liste de TOUS les animés (Base de données)
      const allRes = await client.get("/animeList");
      const allAnimes = allRes.data.data;
      
      let watchIds = [], wishIds = [], compIds = [], favIds = [];
      let myRatingsMap = {}; // Pour stocker les notes perso : { "ID_ANIME": NOTE }

      // 2. Si l'utilisateur est connecté, récupérer SES données
      if (isAuthenticated && token) {
        try {
            const [watch, wish, comp, fav, genresRes, scoresRes, ratingsRes] = await Promise.all([
                client.get("/lists/watchlist"),
                client.get("/lists/wishlist"),
                client.get("/lists/completed"),
                client.get("/lists/favorites"),
                client.get("/analysis/genres"),
                client.get("/analysis/scores"),
                client.get("/ratings/user") // <-- On récupère les notes
            ]);

            watchIds = watch.data.map(i => String(i.animeId));
            wishIds = wish.data.map(i => String(i.animeId));
            compIds = comp.data.map(i => String(i.animeId));
            favIds = fav.data.map(i => String(i.animeId));

            // Mapping des notes pour accès rapide
            if (ratingsRes.data && Array.isArray(ratingsRes.data)) {
                ratingsRes.data.forEach(r => {
                    // On gère les deux cas possibles : 'score' ou 'rating'
                    const val = r.score !== undefined ? r.score : r.rating;
                    myRatingsMap[String(r.animeId)] = Number(val);
                });
            }

            // Mise à jour des états pour les graphiques
            setGenreData(genresRes.data); 
            setScoreData(scoresRes.data);

        } catch (analyticsError) {
            console.log("Erreur chargement données utilisateur:", analyticsError);
        }
      }

      // 3. Fusionner les infos globales avec les infos utilisateur
      const merged = allAnimes.map(anime => {
        const curId = String(anime.malId);
        let status = null;
        if (watchIds.includes(curId)) status = 'ongoing';
        else if (compIds.includes(curId)) status = 'completed';
        else if (wishIds.includes(curId)) status = 'wishlist';

        // On récupère la note perso depuis la map, ou 0 si pas noté
        const pScore = myRatingsMap[curId] ? Number(myRatingsMap[curId]) : 0;

        return {
          ...anime,
          id: anime._id,
          status: status,
          isInWishlist: wishIds.includes(curId),
          isFavorite: favIds.includes(curId),
          personalScore: pScore, // <--- Donnée pour le graphique "Top Rated"
        };
      });
      
      setAnimeData(merged);

    } catch (err) { 
        console.error("Erreur fetchAnimesFromAPI:", err); 
    } finally { 
        setLoading(false);
        setLoadingAnalytics(false);
    }
  };

  // Helper pour mettre à jour le statut
  const sendStatusUpdate = async (animeId, status, isFavorite) => {
    const body = { animeId: parseInt(animeId), listType: status };
    if (typeof isFavorite === 'boolean') body.isFavorite = isFavorite;
    return await client.post('/lists/status', body);
  };

  // --- ACTIONS UTILISATEUR ---

  const startWatching = async (malId) => {
    if (!checkAuth()) return false;
    try {
      setAnimeData(prev => prev.map(a => a.malId === malId ? { ...a, status: "ongoing" } : a));
      await sendStatusUpdate(malId, "ONGOING");
      fetchAnimesFromAPI();
      return true;
    } catch (e) { return false; }
  };

  const addToWishlist = async (malId) => {
    if (!checkAuth()) return false;
    try {
      await sendStatusUpdate(malId, "WISHLIST");
      fetchAnimesFromAPI();
      return true;
    } catch (e) { return false; }
  };

  const removeFromWishlist = async (anime) => {
    const idToUse = anime?.malId || anime?.id || anime;
    if (!idToUse) {
      Alert.alert("Erreur", "ID introuvable");
      return;
    }
    setAnimeData(prev => prev.filter(a => String(a.malId) !== String(idToUse)));
    try {
      await client.post('/lists/status', { animeId: Number(idToUse), listType: 'DROPPED' });
    } catch (error) {
      fetchAnimesFromAPI();
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

  // --- FONCTION NOTATION AVEC ALERTE DE SUCCÈS ---
  const rateAnime = async (animeId, rating) => {
    if (!checkAuth()) return false;

    try {
        console.log(`Envoi de la note ${rating} pour l'anime ${animeId}...`);
        
        // On envoie 'score' car c'est ce que le backend attend
        const response = await client.post('/ratings', { 
            animeId: String(animeId), 
            score: Number(rating) 
        });

        if (response.status === 200 || response.status === 201) {
            console.log("Note enregistrée ! Mise à jour...");
            
            // 1. Rechargement immédiat des données
            await fetchAnimesFromAPI(); 
            
            // 2. Alerte de succès pour l'utilisateur
            Alert.alert(
                "Succès", 
                `Votre note de ${rating}/5 a bien été enregistrée !`
            );
            
            return true;
        }
    } catch (error) {
        console.error("Erreur rateAnime:", error.response?.data || error.message);
        Alert.alert("Erreur", "Impossible d'enregistrer la note.");
        return false;
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchAnimesFromAPI();
  }, [token, isAuthenticated]);

  return (
    <AnimeContext.Provider value={{
        animeData, 
        loading, 
        genreData, 
        scoreData, 
        loadingAnalytics,

        addToWishlist, 
        removeFromWishlist, 
        startWatching, 
        markAsCompleted, 
        toggleFavorite, 
        fetchAnimesFromAPI, 
        resetUserData,
        rateAnime 
    }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => useContext(AnimeContext);