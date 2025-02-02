import { NextResponse } from "next/server";
import { generateQuiz } from "@/lib/openai";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { topic, userId } = await req.json();
    
    const quiz = await generateQuiz(topic);
    
    // Store quiz in MongoDB
    const client = await clientPromise;
    const quizzes = client.db().collection("quizzes");
    await quizzes.insertOne({
      userId,
      topic,
      questions: quiz.questions,
      createdAt: new Date(),
    });

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}