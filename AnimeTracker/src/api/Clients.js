import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BASE_URL = "https://animetracker-api.onrender.com/"; 

{/*Ici on se connect au backend avec notre ip pour l'instant en utilisant 
 le port 3000, ou roule notre backend du cours de collecte de doonées*/}
const client = axios.create({
  baseURL: BASE_URL,
});

// Ajoute automatiquement le token JWT sur chaque requête si présent
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
