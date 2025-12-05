import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AuthProvider } from "./src/context/AuthContext";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SettingsScreen from "./src/screens/SettingScreen";

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
          if (route.name === "Watchlist") iconName = focused ? "list" : "list";
          if (route.name === "Favorites") iconName = focused ? "heart" : "heart";
          if (route.name === "Settings") iconName = focused ? "settings" : "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Watchlist" component={EmptyPage} />
      <Tab.Screen name="Favorites" component={EmptyPage} />
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
    <AuthProvider>
      <NavigationContainer> 
        <Stack.Navigator> {/*Stack utilisé pour éviter que Home apparaisse en popup après le login (navigation.replace).*/}
          <Stack.Screen 
            name="Tabs" 
            component={Tabs} 
            options={{ headerShown: false }} 
          />
          {/*Le Stack Navigator permet d'afficher Login/Register comme des écrans séparés */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}