import { useAuth } from "@/auth/useAuth";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { BASE_URL } from "@/config/apiConfig";
import axios from "axios";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 40;

// Proteção contra dados inválidos
const safe = (n: any) => Number(n) || 0;

export default function Dashboard() {
  useAuthGuard();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await axios.get(`${BASE_URL}/stats/dashboard/${user?.id}`);
        setStats(data);
      } catch (err) {
        console.log("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4EA8DE" />
      </View>
    );
  }

  // FALLBACK SAFE DATASETS
  const categoriasData = stats.graficos.categorias.length
    ? stats.graficos.categorias
    : [{ categoria: "Nenhum", quantidade: 1 }];

  const semanaData = stats.graficos.semana.length
    ? stats.graficos.semana
    : [{ dia: "—", quantidade: 1 }];

  const diasMesData = stats.graficos.diasMes.length
    ? stats.graficos.diasMes
    : [{ dia: 1, quantidade: 1 }];

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <LinearGradient colors={["#5E60CE", "#4EA8DE"]} style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Olá, {stats.usuario.nome}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>

        {/* CARD PONTOS */}
        <View style={styles.cardLarge}>
          <Text style={styles.cardTitle}>Pontos de Fidelidade</Text>
          <Text style={styles.cardValue}>{safe(stats.fidelidade.total)} pontos</Text>
        </View>

        {/* ROW 1 */}
        <View style={styles.row}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Concluídas (mês)</Text>
            <Text style={styles.cardValue}>{safe(stats.entregas.concluidasMes)}</Text>
          </View>

          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Gasto (mês)</Text>
            <Text style={styles.cardValue}>R$ {safe(stats.entregas.valorMensal)}</Text>
          </View>
        </View>

        {/* ROW 2 */}
        <View style={styles.row}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Pendentes</Text>
            <Text style={styles.cardValue}>{safe(stats.entregas.pendentes)}</Text>
          </View>

          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Canceladas</Text>
            <Text style={styles.cardValue}>{safe(stats.entregas.canceladas)}</Text>
          </View>
        </View>

        {/* PIE CHART */}
        <View style={styles.cardLarge}>
          <Text style={styles.graphTitle}>Entregas por Categoria</Text>

          <PieChart
            data={categoriasData.map((c: any, i: number) => ({
              name: c.categoria || "Outro",
              population: safe(c.quantidade),
              color: ["#5E60CE", "#4EA8DE", "#64DFDF", "#80FFDB"][i % 4],
              legendFontColor: "#FFF",
              legendFontSize: 12,
            }))}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>

        {/* BAR CHART */}
        <View style={styles.cardLarge}>
          <Text style={styles.graphTitle}>Entregas por Dia da Semana</Text>

          <BarChart
            data={{
              labels: semanaData.map((d: any) => d.dia),
              datasets: [{ data: semanaData.map((d: any) => safe(d.quantidade)) }],
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* LINE CHART */}
        <View style={styles.cardLarge}>
          <Text style={styles.graphTitle}>Atividade no Mês</Text>

          <LineChart
            data={{
              labels: diasMesData.map((d: any) => String(d.dia)),
              datasets: [{ data: diasMesData.map((d: any) => safe(d.quantidade)) }],
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundColor: "#2C2C2E",
  backgroundGradientFrom: "#2C2C2E",
  backgroundGradientTo: "#2C2C2E",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(100, 200, 255, ${opacity})`,
  labelColor: () => "#FFF",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loadingContainer: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  header: { paddingTop: 70, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#E8E8E8", fontSize: 16, marginTop: 4 },
  content: { padding: 20, gap: 16 },
  row: { flexDirection: "row", gap: 16 },
  cardSmall: { flex: 1, backgroundColor: "#2C2C2E", padding: 18, borderRadius: 16 },
  cardLarge: { backgroundColor: "#2C2C2E", padding: 20, borderRadius: 20, alignItems: "center" },
  cardTitle: { color: "#FFF", fontSize: 16, marginBottom: 6 },
  cardValue: { color: "#4EA8DE", fontSize: 22, fontWeight: "bold" },
  graphTitle: { color: "#FFF", fontSize: 18, marginBottom: 14, fontWeight: "600" },
});