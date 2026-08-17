import { Screen } from "@/components/Screen";
import { createPractice } from "@/services/practiceApi";
import { usePracticeStore } from "@/store/practiceStore";
import type { Difficulty } from "@/types/practice";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
};

export default function AddPracticeScreen() {
  const router = useRouter();

  const addPractice = usePracticeStore((state) => state.addPractice);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const durationValue = Number(duration);

    const textOnlyRegex = /^[\p{L}\s.,!?'"()\-:;]+$/u;

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Title must be 200 characters or less.");
      return;
    }

    if (!textOnlyRegex.test(trimmedTitle)) {
      setError("Title can only contain letters, spaces, and punctuation.");
      return;
    }

    if (!trimmedDescription) {
      setError("Description is required.");
      return;
    }

    if (!textOnlyRegex.test(trimmedDescription)) {
      setError(
        "Description can only contain letters, spaces, and punctuation.",
      );
      return;
    }

    if (!duration || !Number.isInteger(durationValue) || durationValue <= 0) {
      setError("Duration must be a whole number greater than 0.");
      return;
    }

    if (!difficulty) {
      setError("Please select a difficulty.");
      return;
    }

    try {
      setSaving(true);

      const practice = await createPractice({
        title: trimmedTitle,
        description: trimmedDescription,
        duration: durationValue,
        difficulty,
      });

      addPractice(practice);

      router.back();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create practice.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Add Practice" }} />

      <Screen>
        <ScrollView
          className="flex-1 bg-background-light dark:bg-background-dark"
          contentContainerClassName="px-5 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="border-b border-black/20 pb-6 pt-6 dark:border-white/20">
            <Text className="text-xs font-medium tracking-[3px] text-muted-light dark:text-muted-dark">
              NEW SESSION
            </Text>

            <Text className="mt-2 text-5xl font-bold tracking-tight text-foreground-light dark:text-foreground-dark">
              Add Practice.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-8 pt-7">
            {/* Title */}
            <View>
              <Text className="mb-2 text-[10px] font-medium tracking-[2px] text-muted-light dark:text-muted-dark">
                TITLE
              </Text>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. English Introduction"
                placeholderTextColor="#777"
                editable={!saving}
                className="border-b border-black/20 py-3 text-base text-foreground-light dark:border-white/20 dark:text-foreground-dark"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="mb-2 text-[10px] font-medium tracking-[2px] text-muted-light dark:text-muted-dark">
                DESCRIPTION
              </Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What do you want to practice?"
                placeholderTextColor="#777"
                multiline
                textAlignVertical="top"
                editable={!saving}
                className="min-h-24 border-b border-black/20 py-3 text-base leading-6 text-foreground-light dark:border-white/20 dark:text-foreground-dark"
              />
            </View>

            {/* Duration */}
            <View>
              <Text className="mb-2 text-[10px] font-medium tracking-[2px] text-muted-light dark:text-muted-dark">
                DURATION · MINUTES
              </Text>

              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="15"
                placeholderTextColor="#777"
                keyboardType="number-pad"
                editable={!saving}
                className="border-b border-black/20 py-3 text-base text-foreground-light dark:border-white/20 dark:text-foreground-dark"
              />
            </View>

            {/* Difficulty */}
            <View>
              <Text className="mb-3 text-[10px] font-medium tracking-[2px] text-muted-light dark:text-muted-dark">
                DIFFICULTY
              </Text>

              <View className="flex-row gap-2">
                {difficulties.map((item) => {
                  const selected = difficulty === item;

                  return (
                    <Pressable
                      key={item}
                      disabled={saving}
                      onPress={() => setDifficulty(item)}
                      className={`border px-3 py-3 ${
                        selected
                          ? "border-black bg-accent dark:border-white"
                          : "border-black/30 dark:border-white/30"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium tracking-wider ${
                          selected
                            ? "text-black"
                            : "text-foreground-light dark:text-foreground-dark"
                        }`}
                      >
                        {difficultyLabels[item]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Error */}
            {error && (
              <View className="border border-red-500/30 px-4 py-3">
                <Text className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View className="mt-1 flex-row gap-3">
              <Pressable
                onPress={handleSave}
                disabled={saving}
                className={`flex-1 bg-accent py-4 ${
                  saving ? "opacity-50" : "active:opacity-70"
                }`}
              >
                <Text className="text-center text-sm font-semibold tracking-widest text-black">
                  {saving ? "SAVING..." : "SAVE"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                disabled={saving}
                className={`flex-1 border border-black/30 py-4 dark:border-white/30 ${
                  saving ? "opacity-50" : "active:opacity-70"
                }`}
              >
                <Text className="text-center text-sm font-semibold tracking-widest text-foreground-light dark:text-foreground-dark">
                  CANCEL
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Screen>
    </>
  );
}
