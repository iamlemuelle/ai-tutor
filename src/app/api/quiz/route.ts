import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateQuiz } from "@/lib/openai";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Generate quiz questions using OpenAI
    const quiz = await generateQuiz(topic);

    // Store quiz in MongoDB
    const client = await clientPromise;
    const result = await client
      .db()
      .collection("quizzes")
      .insertOne({
        userId: new ObjectId(session.user.id),
        topic,
        questions: quiz.questions,
        completed: false,
        createdAt: new Date(),
      });

    return NextResponse.json({
      id: result.insertedId,
      ...quiz,
    });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
