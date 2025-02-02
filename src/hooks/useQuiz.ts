import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useQuiz(topic?: string) {
  const generateQuizMutation = useMutation({
    mutationFn: async (variables: { topic: string; questionCount: number }) => {
      const userId = "679f7cf3bb62ead7afc636f0"; // you need to provide the userId
      return apiClient.quiz.generate(
        variables.topic,
        variables.questionCount,
        userId
      );
    },
  });
  const submitQuizMutation = useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: number[] }) =>
      apiClient.quiz.submit(quizId, answers),
  });

  return {
    isGenerating: generateQuizMutation.isPending,
    generateError: generateQuizMutation.error,
    generateQuiz: generateQuizMutation.mutate,
    quiz: generateQuizMutation.data,
    isSubmitting: submitQuizMutation.isPending,
    submitError: submitQuizMutation.error,
    submitQuiz: submitQuizMutation.mutate,
    score: submitQuizMutation.data?.score,
  };
}
