import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import client from "../api/Clients"; 

const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchAnimesFromAPI = async () => {
    try {
      const res = await client.get("/api/animeList"); 
      setAnimeData(
        res.data.data.map((a) => ({
          id: a._id,           // Mongo ID
          title: a.title,
          image: a.imageUrl,
          rating: a.jikanScore,
          episodes: a.episodes,
          isFavorite: false,
          isInWishlist: false,
          status: null,
        }))
      );
    } catch (err) {
      console.log("Erreur API:", err);
      Alert.alert("Erreur", "Impossible de charger les animés.");
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    fetchAnimesFromAPI();
  }, []);

  const addToWishlist = (id) => {
    const anime = animeData.find((a) => a.id === id);

    if (anime && !anime.isInWishlist) {
      setAnimeData(
        animeData.map((a) =>
          a.id === id ? { ...a, status: "wishlist", isInWishlist: true } : a
        )
      );
      Alert.alert("Ajouté !", `${anime.title} ajouté à la wishlist`);
    } else {
      Alert.alert("Info", `${anime.title} est déjà dans la wishlist`);
    }
  };

  const removeFromWishlist = (id) => {
    const anime = animeData.find((a) => a.id === id);
    setAnimeData(
      animeData.map((a) =>
        a.id === id ? { ...a, isInWishlist: false } : a
      )
    );
    Alert.alert("Retiré", `${anime?.title} retiré`);
  };

  const startWatching = (id) => {
    const anime = animeData.find((a) => a.id === id);
    setAnimeData(
      animeData.map((a) =>
        a.id === id ? { ...a, status: "ongoing", isInWishlist: false } : a
      )
    );
    Alert.alert("Cool !", `Tu commences ${anime?.title} !`);
  };

  const toggleFavorite = (id) => {
    setAnimeData(
      animeData.map((anime) =>
        anime.id === id ? { ...anime, isFavorite: !anime.isFavorite } : anime
      )
    );
  };

  const markAsCompleted = (id) => {
    const anime = animeData.find((a) => a.id === id);
    setAnimeData(
      animeData.map((a) =>
        a.id === id ? { ...a, status: "completed" } : a
      )
    );
    Alert.alert("Terminé !", `${anime?.title} marqué comme terminé !`);
  };

  return (
    <AnimeContext.Provider
      value={{
        animeData,
        loading,
        addToWishlist,
        removeFromWishlist,
        startWatching,
        toggleFavorite,
        markAsCompleted,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnime doit être utilisé dans AnimeProvider");
  }
  return context;
};
