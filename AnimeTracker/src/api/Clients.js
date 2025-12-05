import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Les gars ici juste changer avec votre ip local
//aller dans terminal powershell et tapez ipconfig
const BASE_URL = "http://ton_ip:3000/api"; 

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
