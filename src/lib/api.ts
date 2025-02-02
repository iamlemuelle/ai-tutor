import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LearningResponse {
  summary: string;
  resources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

export interface QuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface FlashcardResponse {
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

export interface TutorResponse {
  response: string;
}

export const apiClient = {
  learn: {
    getSummary: async (topic: string): Promise<LearningResponse> => {
      const { data } = await api.post("/learn", { topic });
      return data;
    },
  },
  quiz: {
    generate: async (
      topic: string,
      questionCount: number = 5,
      userId: string
    ): Promise<QuizResponse> => {
      const { data } = await api.post("/quiz", { topic, questionCount });
      return data;
    },
    submit: async (
      quizId: string,
      answers: number[]
    ): Promise<{ score: number }> => {
      const { data } = await api.post(`/quiz/${quizId}/submit`, { answers });
      return data;
    },
  },
  flashcards: {
    generate: async (
      topic: string,
      cardCount: number = 10
    ): Promise<FlashcardResponse> => {
      const { data } = await api.post("/flashcards", { topic, cardCount });
      return data;
    },
  },
  tutor: {
    ask: async (question: string): Promise<TutorResponse> => {
      const { data } = await api.post("/tutor", { question });
      return data;
    },
  },
};
