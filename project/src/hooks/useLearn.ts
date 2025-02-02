import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useLearningStore } from '@/stores/learningStore';

export function useLearn(topic?: string) {
  const addTopic = useLearningStore((state) => state.addTopic);

  const learningMutation = useMutation({
    mutationFn: apiClient.learn.getSummary,
    onSuccess: () => {
      if (topic) {
        addTopic(topic);
      }
    },
  });

  const recentTopicsQuery = useQuery({
    queryKey: ['recentTopics'],
    queryFn: () => useLearningStore.getState().recentTopics,
  });

  return {
    isLoading: learningMutation.isPending,
    error: learningMutation.error,
    learn: learningMutation.mutate,
    recentTopics: recentTopicsQuery.data || [],
    isRecentTopicsLoading: recentTopicsQuery.isLoading,
  };
}