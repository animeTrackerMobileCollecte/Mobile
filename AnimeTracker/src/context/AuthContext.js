import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/Clients";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadAuthFromStorage = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.warn("Erreur chargement auth:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthFromStorage();
  }, []);

  const login = async (email, password) => {
    const res = await client.post("/auth/login", {
      email,
      password,
    });

    const { token: jwt, user: userData } = res.data;

    setToken(jwt);
    setUser(userData);

    await AsyncStorage.setItem("token", jwt);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

const register = async (username, email, password) => {
  const res = await client.post("/auth/register", {
    username,
    email,
    password,
  });

  const userData = res.data.user;

  return userData; 
};

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
   
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans <AuthProvider />");
  }
  return ctx;
};
