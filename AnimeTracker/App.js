import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AuthProvider } from "./src/context/AuthContext";
import { AnimeProvider } from "./src/context/AnimeContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext"; 
import { COLORS } from "./src/constants/styles"; 

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

function Tabs() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          if (route.name === "Wishlist") iconName = "list";
          if (route.name === "Favorites") iconName = "heart";
          if (route.name === "Settings") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: theme.subText,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <NavigationContainer>
      <AuthProvider>
        <AnimeProvider>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.card },
              headerTintColor: theme.text,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="DashboardStats" component={DashboardStatsScreen} options={{ title: "Analyses" }} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: "Utilisateurs" }} />
            <Stack.Screen name="AnimeDetails" component={AnimeDetailsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </AnimeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}