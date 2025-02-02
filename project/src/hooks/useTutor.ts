import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useTutor() {
  const tutorMutation = useMutation({
    mutationFn: apiClient.tutor.ask,
  });

  return {
    isLoading: tutorMutation.isPending,
    error: tutorMutation.error,
    ask: tutorMutation.mutate,
    response: tutorMutation.data?.response,
  };
}