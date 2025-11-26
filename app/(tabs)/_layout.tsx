import { useAuthGuard } from "@/auth/useAuthGuard";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// Variáveis de cor do Me Chame Já
const ACTIVE = "#4EA8DE"; 
const INACTIVE = "#c9caccff"; 
const TAB_BG = "#000000ff"; 

// Ícone animado
function AnimatedTabIcon({
  name,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.15 : 1, { duration: 130 });
  }, [focused]);

  const styled = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={styled}>
      <Ionicons
        name={name}
        size={26}
        color={focused ? ACTIVE : INACTIVE}
      />
    </Animated.View>
  );
}

// Botão com haptic (Vibração leve ao toque)
function TabButton(props: any) {
  return (
    <Pressable
      onPressIn={() =>
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      {...props}
    />
  );
}

export default function TabLayout() {
  useAuthGuard();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: TabButton,

        tabBarStyle: {
          height: 70,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: TAB_BG,
          borderTopWidth: 1,
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name="minhas-entregas"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="list" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="notificacoes"
        options={{
          title: "Notificações",
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="notifications" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="token"
        options={{
          title: "Token",
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="key" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon name="settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}