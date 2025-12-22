import { StyleSheet, Platform, StatusBar } from 'react-native';

export const COLORS = {
    primary: '#3b82f6',
    secondary: '#22c55e',
    star: '#FFD700',
    red: '#E50914',
    
    light: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#1E293B',
        subText: '#64748B',
        border: '#E2E8F0',
    },
    dark: {
        background: '#0F172A',
        card: '#1E293B',
        text: '#F8FAFC',
        subText: '#94A3B8',
        border: '#334155',
    }
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
    },
    searchInput: {
        fontSize: 16,
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
    }
});

export const cardStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        elevation: 2,
    },
    cardImage: {
        width: 80,
        height: 110,
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
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    tagContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    episodeText: {
        fontSize: 12,
    }
});