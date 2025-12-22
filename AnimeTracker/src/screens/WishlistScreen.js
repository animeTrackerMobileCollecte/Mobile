import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../constants/styles';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard';
import { useAnime } from '../context/AnimeContext';
import { useTheme } from '../context/ThemeContext'; 

export default function WishlistScreen() {
    const { animeData, removeFromWishlist, startWatching, toggleFavorite } = useAnime();
    
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? COLORS.dark : COLORS.light;

    const wishlistAnimes = animeData.filter(anime => anime.isInWishlist === true);

    return (
        <View style={[globalStyles.container, { backgroundColor: theme.background }]}>

            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={[globalStyles.headerTitle, { color: theme.text }]}>Ma Wishlist 📚</Text>
            </View>

            <FlatList
                data={wishlistAnimes}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={() => (
                    <>
                        {/* Barre de recherche (Placeholder visuel ici) */}
                        <View style={[globalStyles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                            <Ionicons name="search" size={20} color={theme.subText} style={{ marginRight: 10 }} />
                            <Text style={{ color: theme.subText }}>Rechercher...</Text>
                        </View>

                        {/* Statistique */}
                        <View style={[globalStyles.statCard, { backgroundColor: COLORS.primary, width: '100%', marginBottom: 20 }]}>
                            <Text style={globalStyles.statNumber}>{wishlistAnimes.length}</Text>
                            <Text style={globalStyles.statLabel}>
                                {wishlistAnimes.length === 0 ? 'Aucun animé' :
                                    wishlistAnimes.length === 1 ? 'Animé à regarder' : 'Animés à regarder'}
                            </Text>
                        </View>
                    </>
                )}
                renderItem={({ item }) => (
                    <SwipeableAnimeCard
                        item={item}
                        onToggleFavorite={toggleFavorite}
                        onStartWatching={startWatching}
                        onDelete={removeFromWishlist}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="bookmark-outline" size={80} color={theme.subText} />
                        <Text style={{ fontSize: 18, color: theme.text, fontWeight: 'bold', marginTop: 20 }}>
                            Ta wishlist est vide
                        </Text>
                        <Text style={{ fontSize: 14, color: theme.subText, marginTop: 10, textAlign: 'center' }}>
                            Ajoute des animés depuis l'écran principal !
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}