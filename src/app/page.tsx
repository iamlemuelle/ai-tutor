import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Brain, BookOpen, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center mb-16 space-y-8">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 leading-tight max-w-4xl mx-auto">
            Transform Your Learning Journey with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience a revolutionary way to learn with our AI-powered platform. Get personalized content, adaptive quizzes, and instant tutoring.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/learn" className="gap-2">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tutor">Try AI Tutor</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Smart Summaries</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Get AI-generated summaries that adapt to your learning style and pace. Master complex topics effortlessly.
            </p>
            <Button variant="ghost" className="group" asChild>
              <Link href="/learn" className="gap-2">
                Start Learning 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-violet-500 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
            <div className="mb-6">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Adaptive Quizzes</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Test your knowledge with personalized quizzes that adapt to your progress and learning curve.
            </p>
            <Button variant="ghost" className="group" asChild>
              <Link href="/quizzes" className="gap-2">
                Take a Quiz
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-indigo-500 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
            <div className="mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI Tutor</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Get instant help from our AI tutor. Ask questions and receive detailed explanations anytime.
            </p>
            <Button variant="ghost" className="group" asChild>
              <Link href="/tutor" className="gap-2">
                Chat with AI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}