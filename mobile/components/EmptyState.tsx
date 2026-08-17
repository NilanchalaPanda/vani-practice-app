import { Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="items-center border border-black/10 px-6 py-10 dark:border-white/10">
      <Text className="text-base font-semibold text-foreground-light dark:text-foreground-dark">
        {title}
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-muted-light dark:text-muted-dark">
        {description}
      </Text>
    </View>
  );
}
