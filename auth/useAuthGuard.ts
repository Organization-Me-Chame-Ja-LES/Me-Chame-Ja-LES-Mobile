import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./useAuth";

export function useAuthGuard() {
  const { isLogged, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Enquanto estiver carregando, não navega
    if (loading) return;

    // Não logado, manda para tela de login
    if (!isLogged) {
      router.replace("/(auth)/login");
    }
  }, [loading, isLogged]);
}