import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/auth/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* GRUPO DE AUTENTICAÇÃO */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* GRUPO DE TABS (ÁREA APÓS LOGIN) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* MODAL */}
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />

          {/* DASHBOARD */}
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}