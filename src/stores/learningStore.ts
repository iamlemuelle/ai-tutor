import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LearningState {
  recentTopics: string[];
  addTopic: (topic: string) => void;
  clearTopics: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      recentTopics: [],
      addTopic: (topic) =>
        set((state) => ({
          recentTopics: [topic, ...state.recentTopics].slice(0, 5),
        })),
      clearTopics: () => set({ recentTopics: [] }),
    }),
    {
      name: 'learning-store',
    }
  )
);