import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../constants/styles';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard';
import { useAnime } from '../context/AnimeContext';
import { useTheme } from '../context/ThemeContext';

export default function WatchlistScreen() {
    // 1. On récupère markAsCompleted pour pouvoir finir un animé depuis cette liste
    const { animeData, removeFromWishlist, markAsCompleted,OnStartWatching, toggleFavorite } = useAnime();
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? COLORS.dark : COLORS.light;

    // 2. Filtrer par le statut 'ongoing' (En cours)
    const watchlistAnimes = animeData.filter(anime => anime.status === 'ongoing');

    return (
        <View style={[globalStyles.container, { backgroundColor: theme.background }]}>
            
            {/* Header fixe */}
            <View style={globalStyles.header}>
                <Text style={[globalStyles.headerTitle, { color: theme.text }]}>Ma Watchlist 📺</Text>
            </View>

            <FlatList
                data={watchlistAnimes}
                keyExtractor={item => item.malId.toString()}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                
                // On met tout ce qui était en haut dans le Header de la FlatList
                ListHeaderComponent={() => (
                    <View>
                        <View style={[globalStyles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                            <Ionicons name="search" size={20} color={theme.subText} style={{ marginRight: 10 }} />
                            <Text style={{ color: theme.subText }}>Rechercher...</Text>
                        </View>

                        <View style={[globalStyles.statCard, { backgroundColor: COLORS.primary, width: '100%', marginBottom: 20 }]}>
                            <Text style={globalStyles.statNumber}>{watchlistAnimes.length}</Text>
                            <Text style={globalStyles.statLabel}>
                                {watchlistAnimes.length <= 1 ? 'Animé en cours' : 'Animés en cours'}
                            </Text>
                        </View>
                    </View>
                )}

                renderItem={({ item }) => (
                    <SwipeableAnimeCard
                        item={item}
                        onToggleFavorite={toggleFavorite}
                        onStartWatching={() => markAsCompleted(item.malId)} 
                        onDelete={() => removeFromWishlist(item)}
                    />
                )}

                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="play-circle-outline" size={80} color={theme.subText} />
                        <Text style={{ fontSize: 18, color: theme.text, fontWeight: 'bold', marginTop: 20 }}>
                            Rien en cours...
                        </Text>
                        <Text style={{ fontSize: 14, color: theme.subText, marginTop: 10, textAlign: 'center' }}>
                            Va dans ta Wishlist pour commencer un animé !
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}