import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../constants/styles';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard';
import { useAnime } from '../context/AnimeContext';
import { useTheme } from '../context/ThemeContext'; 

export default function FavoriteScreen() {
    const { 
        animeData, 
        toggleFavorite, 
        addToWishlist, 
        startWatching, 
        markAsCompleted 
    } = useAnime();

    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? COLORS.dark : COLORS.light;
    const [localSearch, setLocalSearch] = useState("");

    const favoriteAnimes = animeData.filter(anime => {
        const isFav = anime.isFavorite === true;
        const matchesSearch = anime.title.toLowerCase().includes(localSearch.toLowerCase());
        return isFav && matchesSearch;
    });

    return (
        <View style={[globalStyles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={[globalStyles.headerTitle, { color: theme.text }]}>Mes Favoris ❤️</Text>
            </View>

            {/* Barre de recherche locale */}
            <View style={[globalStyles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                <Ionicons name="search" size={20} color={theme.subText} style={{ marginRight: 10 }} />
                <TextInput 
                    placeholder="Chercher dans mes favoris..."
                    placeholderTextColor={theme.subText}
                    style={{ flex: 1, color: theme.text }}
                    value={localSearch}
                    onChangeText={setLocalSearch}
                />
            </View>

            <FlatList
                data={favoriteAnimes}
                keyExtractor={item => (item.id || item.malId).toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={() => (
                    /* Statistique */
                    <View style={[globalStyles.statCard, { backgroundColor: COLORS.secondary, width: '100%', marginBottom: 20 }]}>
                        <Text style={globalStyles.statNumber}>{favoriteAnimes.length}</Text>
                        <Text style={globalStyles.statLabel}>
                            {favoriteAnimes.length <= 1 ? 'Coup de cœur' : 'Coups de cœur'}
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <SwipeableAnimeCard
                        item={item}
                        onToggleFavorite={toggleFavorite}
                        onAddToWishlist={addToWishlist}
                        onStartWatching={startWatching}
                        onMarkCompleted={markAsCompleted}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 50, paddingHorizontal: 20 }}>
                        <Ionicons name="heart-outline" size={80} color={theme.subText} />
                        <Text style={{ fontSize: 18, color: theme.text, fontWeight: 'bold', marginTop: 20 }}>
                            {localSearch ? "Aucun résultat" : "Aucun favori pour le moment"}
                        </Text>
                        <Text style={{ fontSize: 14, color: theme.subText, marginTop: 10, textAlign: 'center' }}>
                            {localSearch 
                                ? "Essaie un autre nom d'animé." 
                                : "Clique sur le petit cœur sur les fiches d'animés pour les retrouver ici !"}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}