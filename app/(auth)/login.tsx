import { useAuth } from "@/auth/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin() {
    setErro("");

    const resultado = await login(email, senha);

    if (resultado) {
      setErro(resultado);
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      {erro !== "" && <Text style={styles.error}>{erro}</Text>}

      <Pressable style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Acessar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 24 },
  title: { color: "#FFF", fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#2C2C2E", padding: 14, borderRadius: 12, color: "#FFF", marginBottom: 10 },
  btn: { backgroundColor: "#5E60CE", padding: 14, borderRadius: 12, marginTop: 10 },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "600", textAlign: "center" },
  error: { color: "#FF6B6B", marginBottom: 10, textAlign: "center" },
});