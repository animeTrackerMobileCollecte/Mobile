import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../constants/styles';
import SwipeableAnimeCard from '../components/SwipeableAnimeCard';
import { useAnime } from '../context/AnimeContext';


export default function WatchlistScreen() {

    const { animeData, removeFromWishlist, startWatching, toggleFavorite } = useAnime();


    const wishlistAnimes = animeData.filter(anime => anime.isInWishlist === true);

    return (
        <View style={globalStyles.container}>


            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Ma Watchlist 📺</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={globalStyles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />
                    <Text style={{ color: COLORS.lightText }}>Rechercher...</Text>
                </View>

                <View style={[globalStyles.statCard, { backgroundColor: COLORS.primary, width: '100%', marginBottom: 20 }]}>
                    <Text style={globalStyles.statNumber}>{wishlistAnimes.length}</Text>
                    <Text style={globalStyles.statLabel}>
                        {wishlistAnimes.length === 0 ? 'Aucun animé' :
                            wishlistAnimes.length === 1 ? 'Animé à regarder' : 'Animés à regarder'}
                    </Text>
                </View>

                <FlatList
                    data={wishlistAnimes}
                    renderItem={({ item }) => (
                        <SwipeableAnimeCard
                            item={item}
                            onToggleFavorite={toggleFavorite}
                            onStartWatching={startWatching}
                            onDelete={removeFromWishlist}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Ionicons name="bookmark-outline" size={80} color={COLORS.lightText} />
                            <Text style={{ fontSize: 18, color: COLORS.darkText, fontWeight: 'bold', marginTop: 20 }}>
                                Ta watchlist est vide
                            </Text>
                            <Text style={{ fontSize: 14, color: COLORS.lightText, marginTop: 10, textAlign: 'center' }}>
                                Ajoute des animés depuis l'écran principal !
                            </Text>
                        </View>
                    )}
                />

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}
