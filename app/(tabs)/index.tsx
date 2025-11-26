import { useAuthGuard } from "@/auth/useAuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/auth/useAuth";

export default function HomeScreen() {
  useAuthGuard();
  const router = useRouter();

  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5E60CE", "#4EA8DE"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Me Chame Já</Text>
        <Text style={styles.headerSubtitle}>Notificações em tempo real</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* GOSTARIA DE COLOCAR AQUI */}
        {user && (
          <TouchableOpacity style={styles.card}>
            <Ionicons name="person-circle-outline" size={40} color="#64DFDF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Olá, {user.name}</Text>
              <Text style={styles.cardDesc}>É um prazer ter você de volta!</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* MINHAS ENTREGAS */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/dashboard")}
        >
          <Ionicons name="bar-chart" size={40} color="#64DFDF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardDesc}>Veja dados da sua atividade</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* MINHAS ENTREGAS */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/minhas-entregas")}
        >
          <Ionicons name="list" size={40} color="#64DFDF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Minhas Entregas</Text>
            <Text style={styles.cardDesc}>Veja o status atualizado</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* NOTIFICAÇÕES */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/notificacoes")}
        >
          <Ionicons name="notifications" size={40} color="#64DFDF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Notificações</Text>
            <Text style={styles.cardDesc}>Atualizações das suas entregas</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* CONFIGURAÇÕES */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/configuracoes")}
        >
          <Ionicons name="settings" size={40} color="#64DFDF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Configurações</Text>
            <Text style={styles.cardDesc}>Preferências e conta</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000ff" },
  header: { paddingTop: 70, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#E8E8E8", fontSize: 16, marginTop: 4 },
  content: { padding: 20, gap: 16 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#2C2C2E", padding: 20, borderRadius: 20, gap: 20, },
  cardTitle: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  cardDesc: { color: "#AAA", fontSize: 14 },
});