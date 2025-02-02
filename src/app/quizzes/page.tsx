"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function QuizzesPage() {
  const [topic, setTopic] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const {
    generateQuiz,
    isGenerating,
    generateError,
    quiz,
    submitQuiz,
    isSubmitting,
    score,
  } = useQuiz();

  const handleGenerateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setQuizSubmitted(false);
    setSelectedAnswers([]);
    generateQuiz(topic);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (!quiz || selectedAnswers.length !== quiz.questions.length) return;
    submitQuiz({ quizId: "current", answers: selectedAnswers });
    setQuizSubmitted(true);
  };

  const isQuizComplete =
    quiz && selectedAnswers.length === quiz.questions.length;

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
              Test Your Knowledge
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Generate a quiz on any topic and challenge yourself
            </p>
          </motion.div>

          {/* Quiz Generation Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleGenerateQuiz}
            className="mb-12"
          >
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter a topic (e.g., 'Ancient Rome')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                Generate Quiz
              </Button>
            </div>
          </motion.form>

          {/* Error Display */}
          {generateError && (
            <Card className="p-6 mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">
                Error: {generateError.message}
              </p>
            </Card>
          )}

          {/* Quiz Questions */}
          {quiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {quiz.questions.map((question, questionIndex) => (
                <Card key={questionIndex} className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    {questionIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() =>
                          handleAnswerSelect(questionIndex, optionIndex)
                        }
                        disabled={quizSubmitted}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedAnswers[questionIndex] === optionIndex
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        } ${
                          quizSubmitted
                            ? optionIndex === question.correctAnswer
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : selectedAnswers[questionIndex] === optionIndex
                              ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                              : ""
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {quizSubmitted &&
                            optionIndex === question.correctAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                          {quizSubmitted &&
                            selectedAnswers[questionIndex] === optionIndex &&
                            optionIndex !== question.correctAnswer && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!isQuizComplete || isSubmitting || quizSubmitted}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Submit Quiz
                </Button>
              </motion.div>

              {/* Score Display */}
              {quizSubmitted && score !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Card className="p-6 bg-primary text-primary-foreground">
                    <h3 className="text-2xl font-bold mb-2">Your Score</h3>
                    <p className="text-4xl font-bold">{score}%</p>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
