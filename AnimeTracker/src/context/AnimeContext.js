
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { MOCK_DATA_INITIAL } from '../data/mockData';

const AnimeContext = createContext();


export const AnimeProvider = ({ children }) => {
    const [animeData, setAnimeData] = useState(MOCK_DATA_INITIAL);


    const addToWishlist = (id) => {
        const anime = animeData.find(a => a.id === id);

        if (anime && !anime.isInWishlist) {
            setAnimeData(animeData.map(a =>
                a.id === id ? { ...a, status: 'wishlist', isInWishlist: true } : a
            ));
            Alert.alert("Ajouté !", `${anime.title} ajouté à la wishlist`);
        } else if (anime && anime.isInWishlist) {
            Alert.alert("Info", `${anime.title} est déjà dans la wishlist`);
        }
    };


    const removeFromWishlist = (id) => {
        const anime = animeData.find(a => a.id === id);

        setAnimeData(animeData.map(a =>
            a.id === id ? { ...a, isInWishlist: false } : a
        ));

        Alert.alert("Retiré", `${anime?.title} retiré`);
    };


    const startWatching = (id) => {
        const anime = animeData.find(a => a.id === id);

        setAnimeData(animeData.map(a =>
            a.id === id ? { ...a, status: 'ongoing', isInWishlist: false } : a
        ));

        Alert.alert("Cool !", `Tu commences ${anime?.title} !`);
    };


    const toggleFavorite = (id) => {
        setAnimeData(animeData.map(anime =>
            anime.id === id ? { ...anime, isFavorite: !anime.isFavorite } : anime
        ));
    };

    // Marquer un animé comme terminé
    const markAsCompleted = (id) => {
        const anime = animeData.find(a => a.id === id);

        setAnimeData(animeData.map(a =>
            a.id === id ? { ...a, status: 'completed' } : a
        ));

        Alert.alert("Terminé !", `${anime?.title} marqué comme terminé !`);
    };

    return (
        <AnimeContext.Provider value={{
            animeData,
            addToWishlist,
            removeFromWishlist,
            startWatching,
            toggleFavorite,
            markAsCompleted,
        }}>
            {children}
        </AnimeContext.Provider>
    );
};

// Pour utiliser le context dans les autres fichiers
export const useAnime = () => {
    const context = useContext(AnimeContext);
    if (!context) {
        throw new Error('useAnime doit être dans AnimeProvider');
    }
    return context;
};
