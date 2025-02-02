"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLearn } from "@/hooks/useLearn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, BookOpen, History, ExternalLink, Loader2 } from "lucide-react";

export default function LearnPage() {
  const [topic, setTopic] = useState("");
  const { learn, isLoading, error, recentTopics } = useLearn();
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
      },
    });
  };

  console.log("API Response:", learningContent);

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
              Enter any topic and get an AI-generated summary with helpful
              resources
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mb-12"
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
          </motion.form>

          {/* Recent Topics */}
          {recentTopics.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {recentTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => setTopic(topic)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Learning Content */}
          {error && (
            <Card className="p-6 mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">
                Error: {error.message}
              </p>
            </Card>
          )}

          {learningContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Summary */}
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Summary</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {learningContent.summary}
                </p>
              </Card>

              {/* Resources */}
              <Card className="p-8">
                <h2 className="text-xl font-semibold mb-6">
                  Additional Resources
                </h2>
                <div className="space-y-6">
                  {Array.isArray(learningContent?.resources) &&
                    learningContent.resources.map((resource, index) => (
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
      </div>
    </div>
  );
}
