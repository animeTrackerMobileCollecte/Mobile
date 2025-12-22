import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AuthProvider } from "./src/context/AuthContext";
import { AnimeProvider } from "./src/context/AnimeContext";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SettingsScreen from "./src/screens/SettingScreen";
import WishlistScreen from "./src/screens/WishlistScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import DashboardStatsScreen from "./src/screens/DashboardStatsScreen";
import AnimeDetailsScreen from "./src/screens/AnimeDetailsScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import AdminUsersScreen from "./src/screens/AdminUserScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs (Home + autres onglets simples)
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = focused ? "home" : "home";
          if (route.name === "Wishlist") iconName = focused ? "list" : "list";
          if (route.name === "Favorites") iconName = focused ? "heart" : "heart";
          if (route.name === "Settings") iconName = focused ? "settings" : "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      
    </Tab.Navigator>
  );
}

// simple placeholder
function EmptyPage() {
  return null;
}

// simple stack (Tabs + Login + Register)
export default function App() {
  return (
    <NavigationContainer>
    <AuthProvider>
      <AnimeProvider>
          <Stack.Navigator>
            {/* Stack utilisé pour éviter que Home apparaisse en popup après le login (navigation.replace). */}
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />

            {/* Le Stack Navigator permet d'afficher Login/Register comme des écrans séparés */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="DashboardStats" component={DashboardStatsScreen} />
            <Stack.Screen name="AnimeDetails" component={AnimeDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
          </Stack.Navigator>
      </AnimeProvider>
    </AuthProvider>
    </NavigationContainer>
  );
}