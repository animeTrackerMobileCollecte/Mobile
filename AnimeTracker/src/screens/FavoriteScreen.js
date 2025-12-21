import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../constants/styles';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard';
import { useAnime } from '../context/AnimeContext';

export default function FavoriteScreen() {
    // On récupère les données et les actions du context
    const { 
        animeData, 
        toggleFavorite, 
        addToWishlist, 
        startWatching, 
        markAsCompleted 
    } = useAnime();

    const [localSearch, setLocalSearch] = useState("");

    // 1. On filtre les favoris
    // 2. On applique une recherche locale si l'utilisateur tape du texte
    const favoriteAnimes = animeData.filter(anime => {
        const isFav = anime.isFavorite === true;
        const matchesSearch = anime.title.toLowerCase().includes(localSearch.toLowerCase());
        return isFav && matchesSearch;
    });

    return (
        <View style={globalStyles.container}>
            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Mes Favoris ❤️</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                
                {/* Barre de recherche locale pour filtrer ses favoris */}
                <View style={globalStyles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />
                    <TextInput 
                        placeholder="Chercher dans mes favoris..."
                        style={{ flex: 1, color: COLORS.darkText }}
                        value={localSearch}
                        onChangeText={setLocalSearch}
                    />
                </View>

                {/* Statistique */}
                <View style={[globalStyles.statCard, { backgroundColor: COLORS.secondary, width: '100%', marginBottom: 20 }]}>
                    <Text style={globalStyles.statNumber}>{favoriteAnimes.length}</Text>
                    <Text style={globalStyles.statLabel}>
                        {favoriteAnimes.length <= 1 ? 'Coup de cœur' : 'Coups de cœur'}
                    </Text>
                </View>

                {/* Liste des favoris */}
                <FlatList
                    data={favoriteAnimes}
                    scrollEnabled={false} // Désactivé car on est dans un ScrollView
                    keyExtractor={item => (item.id || item.malId).toString()}
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
                            <Ionicons name="heart-outline" size={80} color={COLORS.lightText} />
                            <Text style={{ fontSize: 18, color: COLORS.darkText, fontWeight: 'bold', marginTop: 20 }}>
                                {localSearch ? "Aucun résultat" : "Aucun favori pour le moment"}
                            </Text>
                            <Text style={{ fontSize: 14, color: COLORS.lightText, marginTop: 10, textAlign: 'center' }}>
                                {localSearch 
                                    ? "Essaie un autre nom d'animé." 
                                    : "Clique sur le petit cœur sur les fiches d'animés pour les retrouver ici !"}
                            </Text>
                        </View>
                    )}
                />

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}