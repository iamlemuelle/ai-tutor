"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLearn } from "@/hooks/useLearn";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  BookOpen,
  History,
  ExternalLink,
  Loader2,
  Repeat,
} from "lucide-react";

export default function LearnPage() {
  const [topic, setTopic] = useState("");
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardCount, setCardCount] = useState(10);
  const { learn, isLoading, error, recentTopics } = useLearn();
  const { generateFlashcards, isGenerating, flashcards } = useFlashcards();
  const [learningContent, setLearningContent] = useState<{
    summary: string;
    resources: Array<{ title: string; url: string; snippet: string }>;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    learn(topic, {
      onSuccess: (data) => {
        setLearningContent(data);
        generateFlashcards({ topic, cardCount });
      },
    });
  };

  const handleNextCard = () => {
    if (flashcards && currentCard < flashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              What would you like to learn?
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter any topic to get a summary, resources, and flashcards
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mb-12 space-y-4"
          >
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter a topic (e.g., 'Quantum Computing')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Learn
              </Button>
            </div>
            <div className="flex gap-4 items-center">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Number of flashcards:
              </label>
              <Input
                type="number"
                min="5"
                max="20"
                value={cardCount}
                onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
                className="w-24"
              />
            </div>
          </motion.form>

          {/* Content Tabs */}
          {learningContent && (
            <div className="mb-8">
              <div className="flex gap-4 mb-4">
                <Button
                  variant={!showFlashcards ? "default" : "outline"}
                  onClick={() => setShowFlashcards(false)}
                >
                  Summary & Resources
                </Button>
                <Button
                  variant={showFlashcards ? "default" : "outline"}
                  onClick={() => setShowFlashcards(true)}
                >
                  Flashcards
                </Button>
              </div>

              {showFlashcards ? (
                // Flashcards
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {flashcards && flashcards.length > 0 && (
                    <>
                      <Card
                        className={`p-8 min-h-[200px] cursor-pointer transition-all duration-500 ${
                          isFlipped ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        <div className="text-center">
                          <h3 className="text-xl font-semibold mb-4">
                            {isFlipped ? "Answer" : "Question"}
                          </h3>
                          <p className="text-lg">
                            {isFlipped
                              ? flashcards[currentCard].back
                              : flashcards[currentCard].front}
                          </p>
                        </div>
                      </Card>
                      <div className="flex justify-between items-center">
                        <Button
                          onClick={handlePrevCard}
                          disabled={currentCard === 0}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {currentCard + 1} of {flashcards.length}
                        </span>
                        <Button
                          onClick={handleNextCard}
                          disabled={currentCard === flashcards.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                // Summary and Resources
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  <Card className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Summary</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {learningContent.summary}
                    </p>
                  </Card>

                  <Card className="p-8">
                    <h2 className="text-xl font-semibold mb-6">
                      Additional Resources
                    </h2>
                    <div className="space-y-6">
                      {learningContent.resources.map((resource, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="group"
                        >
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-primary group-hover:text-primary/80">
                                {resource.title}
                              </h3>
                              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {resource.snippet}
                            </p>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Card className="p-6 mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">
                Error: {error.message}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
