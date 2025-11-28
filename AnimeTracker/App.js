import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 1. IMPORT IMPORTANT : On importe votre écran avec le design
import HomeScreen from './src/screens/HomeScreen';

// Pour l'instant, on crée des écrans vides pour les autres onglets
// (Vos coéquipiers rempliront leurs fichiers plus tard)
const PlaceholderScreen = ({ name }) => (
  <item style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <item style={{ fontSize: 20 }}>Page {name} (En construction)</item>
  </item>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Gestion des icônes de la barre du bas
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Watchlist') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3b82f6', // Bleu comme votre design
          tabBarInactiveTintColor: 'gray',
          // IMPORTANT : On cache le header par défaut de la navigation
          // car votre HomeScreen a déjà son propre header "AnimeHub"
          headerShown: false, 
        })}
      >
        {/* C'est ICI qu'on charge votre fichier HomeScreen.js */}
        <Tab.Screen name="Home" component={HomeScreen} />
        
        {/* Les autres onglets (vides pour l'instant) */}
        <Tab.Screen name="Watchlist" children={() => <PlaceholderScreen name="Watchlist" />} />
        <Tab.Screen name="Favorites" children={() => <PlaceholderScreen name="Favoris" />} />
        <Tab.Screen name="Settings" children={() => <PlaceholderScreen name="Paramètres" />} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}