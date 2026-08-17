import { create } from "zustand";

import type { Practice } from "@/types/practice";

type PracticeState = {
  practices: Practice[];
  loading: boolean;
  error: string | null;

  setPractices: (practices: Practice[]) => void;
  addPractice: (practice: Practice) => void;
  updatePractice: (practice: Practice) => void;
  removePractice: (id: number) => void;
  markCompleted: (practice: Practice) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const usePracticeStore = create<PracticeState>((set) => ({
  practices: [],
  loading: false,
  error: null,

  setPractices: (practices) => {
    set({ practices });
  },

  addPractice: (practice) => {
    set((state) => ({
      practices: [practice, ...state.practices],
    }));
  },

  updatePractice: (practice) => {
    set((state) => ({
      practices: state.practices.map((item) =>
        item.id === practice.id ? practice : item,
      ),
    }));
  },

  removePractice: (id) => {
    set((state) => ({
      practices: state.practices.filter((item) => item.id !== id),
    }));
  },

  markCompleted: (practice) => {
    set((state) => ({
      practices: state.practices.map((item) =>
        item.id === practice.id ? practice : item,
      ),
    }));
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
