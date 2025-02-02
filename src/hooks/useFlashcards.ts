import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useFlashcards() {
  const flashcardsMutation = useMutation({
    mutationFn: ({ topic, cardCount }: { topic: string; cardCount: number }) =>
      apiClient.flashcards.generate(topic, cardCount),
  });

  return {
    isGenerating: flashcardsMutation.isPending,
    generateError: flashcardsMutation.error,
    generateFlashcards: flashcardsMutation.mutate,
    flashcards: flashcardsMutation.data?.flashcards,
  };
}
