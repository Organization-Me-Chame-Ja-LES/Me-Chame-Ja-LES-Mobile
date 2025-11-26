import { useState } from "react";
import { useAuthGuard } from "@/auth/useAuthGuard";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl } from "react-native";

const notificacoesFake = [
  { id: "1", msg: "Sua entrega #1 atualizou para 'pagamento'" },
  { id: "2", msg: "Sua entrega #1 atualizou para 'pendente'" },
  { id: "3", msg: "Sua entrega #1 atualizou para 'aceita'" },
  { id: "4", msg: "Sua entrega #1 atualizou para 'concluida'" },
  { id: "5", msg: "Sua entrega #1 rendeu 10 pontos de fidelidade" },
  { id: "6", msg: "Sua entrega #2 atualizou para 'pagamento'" },
  { id: "7", msg: "Sua entrega #2 atualizou para 'pendente'" },
];

export default function Notificacoes() {
  useAuthGuard();

  const [notificacoes, setNotificacoes] = useState(notificacoesFake);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pull to Refresh
  function handleRefresh() {
    setIsRefreshing(true);

    setTimeout(() => {
      setNotificacoes(notificacoesFake);
      setIsRefreshing(false);
    }, 800);
  }

  function removerNotificacao(id: string) {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5E60CE", "#4EA8DE"]} style={styles.header}>
        <Text style={styles.headerTitle}>Suas Notificações</Text>
        <Text style={styles.headerSubtitle}>
          Veja as últimas atualizações dos seus pedidos
        </Text>
      </LinearGradient>

      <FlatList
        data={notificacoes}
        style={styles.content}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#4EA8DE"]}
            tintColor="#4EA8DE"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.msg}>{item.msg}</Text>

            <TouchableOpacity
              onPress={() => removerNotificacao(item.id)}
              style={styles.btnDelete}
            >
              <Text style={styles.btnDeleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000ff" },
  header: { paddingTop: 70, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#E8E8E8", fontSize: 16, marginTop: 4 },
  content: { padding: 20 },
  card: { backgroundColor: "#2C2C2E", padding: 16, borderRadius: 12, marginBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 52 },
  msg: { color: "#FFF", fontSize: 15, flexShrink: 1 },
  btnDelete: { paddingHorizontal: 6, paddingVertical: 2 },
  btnDeleteText: { color: "#FF5E5E", fontSize: 20, fontWeight: "bold" },
});