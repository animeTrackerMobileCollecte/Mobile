import { StyleSheet, Platform, StatusBar } from 'react-native';

export const COLORS = {
    primary: '#3b82f6', // Bleu principal
    secondary: '#22c55e', // Vert pour 'Completed'
    background: '#fff',
    lightGray: '#f5f5f5',
    darkText: '#333',
    lightText: '#888',
    star: '#FFD700',
    red: '#E50914', // Rouge pour 'Favorite'
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darkText,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: COLORS.lightGray,
        borderRadius: 50,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '48%',
        padding: 20,
        borderRadius: 16,
        justifyContent: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    inactiveTabText: {
        color: COLORS.lightText,
        fontSize: 13,
    },
});

export const cardStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    cardImage: {
        width: 80,
        height: 100,
        borderRadius: 12,
    },
    cardContent: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-around',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    animeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkText,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    tagContainer: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    episodeText: {
        fontSize: 12,
        color: COLORS.lightText,
    }
});