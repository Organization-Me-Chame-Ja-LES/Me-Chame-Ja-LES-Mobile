import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@/config/apiConfig";

type AuthUser = {
  id: number;
  name: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isLogged: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário salvo no AsyncStorage
  useEffect(() => {
    async function loadUser() {
      try {
        const id = await AsyncStorage.getItem("usuario_id");
        const name = await AsyncStorage.getItem("usuario_nome");

        if (id && name) {
          setUser({ id: Number(id), name });
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // LOGIN
  async function login(email: string, password: string): Promise<string | null> {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        return "Usuário ou senha incorretos";
      }

      const { id, name } = response.data.user;

      await AsyncStorage.setItem("usuario_id", String(id));
      await AsyncStorage.setItem("usuario_nome", name);

      setUser({ id, name });

      return null;
    } catch (error: any) {
      return "Erro ao conectar com o servidor.";
    }
  }

  // LOGOUT
  async function logout() {
    await AsyncStorage.removeItem("usuario_id");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLogged: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}