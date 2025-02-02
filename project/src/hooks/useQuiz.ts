import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useQuiz(topic?: string) {
  const generateQuizMutation = useMutation({
    mutationFn: apiClient.quiz.generate,
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