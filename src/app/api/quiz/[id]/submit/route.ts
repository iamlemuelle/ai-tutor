import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { answers } = await req.json();
    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const quizzes = client.db().collection("quizzes");

    // Get quiz and verify ownership
    const quiz = await quizzes.findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.completed) {
      return NextResponse.json(
        { error: "Quiz already completed" },
        { status: 400 }
      );
    }

    // Calculate score
    const correctAnswers = quiz.questions.reduce(
      (count: any, question: any, index: any) => {
        return count + (question.correctAnswer === answers[index] ? 1 : 0);
      },
      0
    );

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Update quiz with results
    await quizzes.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          completed: true,
          score,
          submittedAnswers: answers,
          completedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ score });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
