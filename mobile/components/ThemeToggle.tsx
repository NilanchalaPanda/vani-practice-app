import { Appearance, Pressable, Text, useColorScheme } from "react-native";

export function ThemeToggle() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  function toggleTheme() {
    Appearance.setColorScheme(isDark ? "light" : "dark");
  }

  return (
    <Pressable
      onPress={toggleTheme}
      className="h-11 w-11 items-center justify-center rounded-full border border-black/15 active:opacity-60 dark:border-white/15"
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Text className="text-lg text-foreground-light dark:text-foreground-dark">
        {isDark ? "☀" : "☾"}
      </Text>
    </Pressable>
  );
}
