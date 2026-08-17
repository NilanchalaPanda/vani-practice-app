import { completePractice } from "@/services/practiceApi";
import { usePracticeStore } from "@/store/practiceStore";
import type { Practice } from "@/types/practice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type PracticeCardProps = {
  practice: Practice;
};

const difficultyLabel: Record<Practice["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const difficultyDot: Record<Practice["difficulty"], string> = {
  beginner: "bg-yellow-400",
  intermediate: "bg-orange-500",
  advanced: "bg-red-500",
};

export function PracticeCard({ practice }: PracticeCardProps) {
  const router = useRouter();
  const markCompleted = usePracticeStore((state) => state.markCompleted);

  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const completed = practice.status === "completed";
  const completionDisabled = completed || completing;

  async function handleComplete() {
    if (completionDisabled) {
      return;
    }

    try {
      setCompleting(true);
      setCompletionError(null);

      const updatedPractice = await completePractice(practice.id);
      markCompleted(updatedPractice);
    } catch (error) {
      setCompletionError(
        error instanceof Error ? error.message : "Unable to complete practice.",
      );
    } finally {
      setCompleting(false);
    }
  }

  return (
    <View className="mb-2 border border-black/15 dark:border-white/15">
      {/* Tapping the main card opens the detail/edit screen. */}
      <Pressable
        onPress={() => router.push(`/practice/${practice.id}`)}
        className="px-4 py-5 active:opacity-60"
      >
        <View className="flex-row items-start">
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-semibold tracking-tight text-foreground-light dark:text-foreground-dark">
              {practice.title}
            </Text>

            <Text
              numberOfLines={2}
              className="mt-2 text-sm leading-5 text-muted-light dark:text-muted-dark"
            >
              {practice.description}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#777777" />
        </View>

        {/* Metadata and completion action */}
        <View className="mt-5 flex-row items-center">
          {/* Status */}
          <View
            className={`rounded px-2 py-1 ${
              completed ? "bg-green-200" : "bg-black/10 dark:bg-white/15"
            }`}
          >
            <Text
              className={`text-[10px] font-semibold ${
                completed
                  ? "text-green-900"
                  : "text-foreground-light dark:text-foreground-dark"
              }`}
            >
              {completed ? "Completed" : "Pending"}
            </Text>
          </View>

          <Text className="mx-2 text-xs text-muted-light dark:text-muted-dark">
            •
          </Text>

          {/* Duration */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={15} color="#777777" />
            <Text className="ml-1.5 text-xs text-foreground-light dark:text-foreground-dark">
              {practice.duration} min
            </Text>
          </View>

          <Text className="mx-2 text-xs text-muted-light dark:text-muted-dark">
            •
          </Text>

          {/* Difficulty */}
          <View className="flex-row items-center">
            <View
              className={`mr-1.5 h-2 w-2 rounded-full ${
                difficultyDot[practice.difficulty]
              }`}
            />
            <Text className="text-xs text-foreground-light dark:text-foreground-dark">
              {difficultyLabel[practice.difficulty]}
            </Text>
          </View>

          <View className="flex-1" />

          {/* Completion action */}
          <Pressable
            onPress={handleComplete}
            disabled={completionDisabled}
            accessibilityRole="button"
            accessibilityLabel={
              completed ? "Practice completed" : "Mark practice as complete"
            }
            accessibilityState={{ disabled: completionDisabled }}
            className={`ml-3 rounded px-2 py-1 ${
              completed
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-accent active:opacity-70"
            } ${completing ? "opacity-50" : ""}`}
          >
            <Text
              className={`text-[10px] font-semibold ${
                completed ? "text-green-800 dark:text-green-300" : "text-black"
              }`}
            >
              {completing
                ? "Saving..."
                : completed
                  ? "Completed"
                  : "Mark as complete"}
            </Text>
          </Pressable>
        </View>

        {completionError && (
          <Text className="mt-3 text-xs text-red-600 dark:text-red-400">
            {completionError}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
