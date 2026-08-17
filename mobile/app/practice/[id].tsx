import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { Screen } from "@/components/Screen";
import {
  getPractice,
  updatePractice,
  deletePractice,
} from "@/services/practiceApi";
import { usePracticeStore } from "@/store/practiceStore";
import type { Difficulty, PracticeStatus } from "@/types/practice";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
};

const statuses: PracticeStatus[] = ["pending", "completed"];

const statusLabels: Record<PracticeStatus, string> = {
  pending: "PENDING",
  completed: "COMPLETED",
};

export default function EditPracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const practiceId = Number(id);

  const practice = usePracticeStore((state) =>
    state.practices.find((item) => item.id === practiceId),
  );

  const updatePracticeInStore = usePracticeStore(
    (state) => state.updatePractice,
  );

  const removePractice = usePracticeStore((state) => state.removePractice);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [status, setStatus] = useState<PracticeStatus>("pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPractice();
  }, [practiceId]);

  async function handleDelete() {
    Alert.alert(
      "Delete Practice",
      "Are you sure you want to delete this practice? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
    );
  }

  async function confirmDelete() {
    try {
      setSaving(true);
      setError(null);

      await deletePractice(practiceId);

      removePractice(practiceId);

      router.back();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete practice.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function loadPractice() {
    try {
      setLoading(true);
      setError(null);

      const data = practice ?? (await getPractice(practiceId));

      setTitle(data.title);
      setDescription(data.description);
      setDuration(String(data.duration));
      setDifficulty(data.difficulty);
      setStatus(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load practice.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const durationValue = Number(duration);

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Description is required.");
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

      const updatedPractice = await updatePractice(practiceId, {
        title: trimmedTitle,
        description: trimmedDescription,
        duration: durationValue,
        difficulty,
        status,
      });

      updatePracticeInStore(updatedPractice);

      router.back();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update practice.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit Practice" }} />

        <Screen>
          <LoadingState message="Loading practice..." />
        </Screen>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit Practice" }} />

        <Screen>
          <LoadingState message="Loading practice..." />
        </Screen>
      </>
    );
  }

  if (error && !practice) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit Practice" }} />

        <Screen>
          <View className="flex-1 justify-center px-5">
            <ErrorState message={error} onRetry={loadPractice} />
          </View>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Edit Practice" }} />

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
              EDIT SESSION · #{id}
            </Text>

            <Text className="mt-2 text-5xl font-bold tracking-tight text-foreground-light dark:text-foreground-dark">
              Edit Practice.
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

            {/* Status */}
            <View>
              <Text className="mb-3 text-[10px] font-medium tracking-[2px] text-muted-light dark:text-muted-dark">
                STATUS
              </Text>

              <View className="flex-row gap-2">
                {statuses.map((item) => {
                  const selected = status === item;

                  return (
                    <Pressable
                      key={item}
                      disabled={saving}
                      onPress={() => setStatus(item)}
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
                        {statusLabels[item]}
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

            <Pressable
              onPress={handleDelete}
              disabled={saving}
              className={`mt-3 border border-red-500/40 py-4 ${
                saving ? "opacity-50" : "active:opacity-70"
              }`}
            >
              <Text className="text-center text-sm font-semibold tracking-widest text-red-600 dark:text-red-400">
                DELETE PRACTICE
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </Screen>
    </>
  );
}
