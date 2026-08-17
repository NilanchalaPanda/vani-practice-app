import { Pressable, Text, View } from "react-native";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="items-center border border-red-500/30 px-5 py-5">
      <Text className="text-center text-sm font-medium text-red-600 dark:text-red-400">
        Something went wrong
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-muted-light dark:text-muted-dark">
        {message}
      </Text>

      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-4 border border-black/20 px-4 py-2 active:opacity-60 dark:border-white/20"
        >
          <Text className="text-xs font-semibold tracking-widest text-foreground-light dark:text-foreground-dark">
            TRY AGAIN
          </Text>
        </Pressable>
      )}
    </View>
  );
}
