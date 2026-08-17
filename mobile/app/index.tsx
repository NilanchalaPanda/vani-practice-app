import { Screen } from "@/components/Screen";
import { Pressable, ScrollView, Text, View } from "react-native";

import { PracticeCard } from "../components/PracticeCard";
import { useRouter } from "expo-router";
import { usePracticeStore } from "@/store/practiceStore";
import { useEffect } from "react";
import { getPractices } from "@/services/practiceApi";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { ThemeToggle } from "@/components/ThemeToggle";

function formatTotalTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

export default function PracticeListScreen() {
  const router = useRouter();

  const { practices, loading, error, setPractices, setLoading, setError } =
    usePracticeStore();

  useEffect(() => {
    loadPractices();
  }, []);

  async function loadPractices() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPractices();

      setPractices(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load practices",
      );
    } finally {
      setLoading(false);
    }
  }

  const total = practices.length;

  const completed = practices.filter(
    (practice) => practice.status === "completed",
  ).length;

  const totalMinutes = practices.reduce(
    (sum, practice) => sum + practice.duration,
    0,
  );

  return (
    <Screen>
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pb-10"
        >
          {/* Header */}
          <View className="flex-row items-start justify-between pt-6">
            <View className="flex-1 pr-4">
              <Text className="text-3xl font-bold tracking-tight text-foreground-light dark:text-foreground-dark">
                Practice Sessions
              </Text>

              <Text className="mt-2 max-w-[300px] text-sm leading-5 text-muted-light dark:text-muted-dark">
                Improve your communication skills with regular practice.
              </Text>
            </View>

            <View className="flex-row gap-2">
              <ThemeToggle />

              <Pressable
                onPress={() => router.push("/practice/new")}
                className="h-11 w-11 items-center justify-center rounded-full bg-black active:opacity-70 dark:bg-white"
              >
                <Text className="text-2xl font-light text-white dark:text-black">
                  +
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Statistics */}
          {!loading && !error && (
            <View className="mt-7 flex-row gap-2">
              <StatCard
                label="TOTAL"
                value={String(total)}
                description="Sessions"
              />

              <StatCard
                label="COMPLETED"
                value={String(completed)}
                description="Sessions"
              />

              <StatCard
                label="TOTAL TIME"
                value={formatTotalTime(totalMinutes)}
                description="All time"
              />
            </View>
          )}

          {loading ? (
            <View className="mt-7 min-h-48">
              <LoadingState message="Loading practices..." />
            </View>
          ) : error ? (
            <View className="mt-7">
              <ErrorState message={error} onRetry={loadPractices} />
            </View>
          ) : practices.length === 0 ? (
            <View className="mt-7">
              <EmptyState
                title="No practice sessions"
                description="Create your first practice session to get started."
              />
            </View>
          ) : (
            <>
              <Text className="mb-3 mt-7 text-base font-semibold text-foreground-light dark:text-foreground-dark">
                Your Sessions
              </Text>

              <View>
                {practices.map((practice) => (
                  <PracticeCard key={practice.id} practice={practice} />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  description: string;
};

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <View className="flex-1 border border-black/10 px-3 py-3 dark:border-white/10">
      <Text className="text-[10px] font-medium tracking-widest text-muted-light dark:text-muted-dark">
        {label}
      </Text>

      <Text className="mt-2 text-2xl font-semibold text-foreground-light dark:text-foreground-dark">
        {value}
      </Text>

      <Text className="mt-1 text-xs text-muted-light dark:text-muted-dark">
        {description}
      </Text>
    </View>
  );
}
