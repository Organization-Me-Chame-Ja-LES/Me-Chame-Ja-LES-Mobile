import { useAuth } from "@/auth/useAuth";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { BASE_URL } from "@/config/apiConfig";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function MinhasEntregas() {
  useAuthGuard();

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [entregas, setEntregas] = useState<Delivery[]>([]);

  type Delivery = {
    id: number;
    value: string;
    status: string;
    description: string;
    categoryType: string;
    transportType: string;
    scheduledTime: string | null;
    completedTime: string | null;
    vehicleId: number;
    driverId: number;
    requesterId: number;
  };

  // Carrega Entregas
  async function loadData() {
    try {
      if (!user?.id) return;

      const r = await axios.get(
        `${BASE_URL}/delivery/getByUser?usuario_id=${user.id}`
      );

      setEntregas(r.data);
    } catch (e) {
      console.warn("Erro ao buscar entregas", e);
    }
  }

  // Carrega ao abrir
  useEffect(() => {
    async function init() {
      await loadData();
      setLoading(false);
    }
    init();
  }, [user?.id]);

  // Pull to Refresh
  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  // Loading inicial
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4EA8DE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5E60CE", "#4EA8DE"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Seus Pedidos</Text>
        <Text style={styles.headerSubtitle}>
          Consulte o seu histórico de corridas
        </Text>
      </LinearGradient>

      <FlatList
        data={entregas}
        style={styles.content}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => {
          const formattedPrice = Number(item.value)
            .toFixed(2)
            .replace(".", ",");

          const formattedDate = item.completedTime
            ? new Date(item.completedTime).toLocaleString("pt-BR")
            : "—";

          return (
            <View style={styles.card}>
              <Text style={styles.title}>Entrega #{item.id}</Text>

              <Text style={styles.status}>
                Status:{" "}
                <Text style={{ color: "#80FFDB" }}>{item.status}</Text>
              </Text>

              <Text style={styles.desc}>{item.description}</Text>

              <Text style={styles.subDesc}>
                Categoria: {item.categoryType} • Transporte:{" "}
                {item.transportType}
              </Text>

              <Text style={[styles.subDesc, { marginTop: 6 }]}>
                Valor:{" "}
                <Text style={{ color: "#64DFDF" }}>
                  R$ {formattedPrice}
                </Text>
              </Text>

              <Text style={[styles.subDesc, { marginTop: 6 }]}>
                Finalizado em:{" "}
                <Text style={{ color: "#AAA" }}>{formattedDate}</Text>
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000ff" },
  header: { paddingTop: 70, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#E8E8E8", fontSize: 16, marginTop: 4 },
  content: { padding: 20, gap: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#2C2C2E", padding: 20, borderRadius: 12, marginBottom: 16 },
  title: { color: "#FFF", fontSize: 20, fontWeight: "600" },
  status: { color: "#64DFDF", marginTop: 4 },
  desc: { color: "#AAA", marginTop: 6 },
  subDesc: { color: "#666", marginTop: 10 },
});