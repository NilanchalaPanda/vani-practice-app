import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#000000" : "#FFFFFF";

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: {
            backgroundColor,
          },
        }}
      />
    </View>
  );
}
