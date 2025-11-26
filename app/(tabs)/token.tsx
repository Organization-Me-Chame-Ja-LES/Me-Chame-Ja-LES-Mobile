import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/auth/useAuth";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { registerForPushNotificationsAsync } from "@/lib/notifications/registerPushToken";
import { BASE_URL } from "@/config/apiConfig";

export default function TokenScreen() {
  useAuthGuard();

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function gerarToken() {
    try {
      setLoading(true);
      setError(null);
      setToken(null);

      const newToken = await registerForPushNotificationsAsync();

      if (!newToken) {
        setError("Não foi possível gerar o token.");
        return;
      }

      setToken(newToken);

      // SALVA O TOKEN NO BANCO AGORA USANDO O ID DO USUÁRIO LOGADO
      await axios.post(`${BASE_URL}/user/register-token`, {
        usuario_id: user?.id,
        usuario_fcm_token: newToken,
      });

    } catch (err: any) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5E60CE", "#4EA8DE"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Token FCM</Text>
        <Text style={styles.headerSubtitle}>Gerar Token de Push Notifications</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* BOTÃO DE GERAR TOKEN */}
        <TouchableOpacity style={styles.card} onPress={gerarToken}>
          <Ionicons name="key" size={40} color="#64DFDF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Gerar Token</Text>
            <Text style={styles.cardDesc}>Clique para gerar e salvar o token no banco</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Loading */}
        {loading && (
          <ActivityIndicator size="large" color="#4EA8DE" style={{ marginTop: 20 }} />
        )}

        {/* Token na tela */}
        {token && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Token gerado:</Text>
            <Text style={styles.resultText}>{token}</Text>
          </View>
        )}

        {/* Erro na tela */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000ff" },
  header: { paddingTop: 70, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#E8E8E8", fontSize: 16, marginTop: 4 },
  content: { padding: 20, gap: 16 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#2C2C2E", padding: 20, borderRadius: 20, gap: 20 },
  cardTitle: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  cardDesc: { color: "#AAA", fontSize: 14 },
  resultBox: { backgroundColor: "#2C2C2E", padding: 20, borderRadius: 20, marginTop: 20 },
  resultTitle: { color: "#4EA8DE", fontSize: 18, marginBottom: 10 },
  resultText: { color: "#FFF", fontSize: 14 },
  errorBox: { backgroundColor: "#3d0000", padding: 20, borderRadius: 20, marginTop: 20 },
  errorText: { color: "#ff6b6b", fontSize: 16 },
});