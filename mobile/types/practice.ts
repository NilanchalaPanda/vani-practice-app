export type Difficulty = "beginner" | "intermediate" | "advanced";

export type PracticeStatus = "pending" | "completed";

export type Practice = {
  id: number;
  title: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
  status: PracticeStatus;
  created_at?: string;
  updated_at?: string;
};

export type CreatePracticeInput = {
  title: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
};

export type UpdatePracticeInput = {
  title?: string;
  description?: string;
  duration?: number;
  difficulty?: Difficulty;
  status?: PracticeStatus;
};
