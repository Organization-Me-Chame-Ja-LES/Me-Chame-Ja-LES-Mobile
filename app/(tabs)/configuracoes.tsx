import { useAuth } from "@/auth/useAuth";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Configuracoes() {
  useAuthGuard();

  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5E60CE", "#4EA8DE"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Configurações</Text>
        <Text style={styles.headerSubtitle}>
          Atualize suas preferências do aplicativo
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* BOTÃO DE LOGOUT */}
        <TouchableOpacity style={styles.cardButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={40} color="#FF6B6B" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardButtonTitle}>Sair da Conta</Text>
            <Text style={styles.cardButtonDesc}>Desconectar do aplicativo</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.text}>Configurações serão adicionadas em breve.</Text>
        </View>

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
  card: { backgroundColor: "#2C2C2E", padding: 16, borderRadius: 12, marginBottom: 12 },
  text: { color: "#FFF", fontSize: 16 },
  cardButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#2C2C2E", padding: 20, borderRadius: 20, gap: 20 },
  cardButtonTitle: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  cardButtonDesc: { color: "#AAA", fontSize: 14 },
});