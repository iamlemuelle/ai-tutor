import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTutorResponse } from "@/lib/openai";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { question } = await req.json();
    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Get user's recent learning history for context
    const client = await clientPromise;
    const history = await client
      .db()
      .collection("learning_history")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const context = history
      .map((item) => `Topic: ${item.topic}\nSummary: ${item.summary}`)
      .join("\n\n");

    const response = await getTutorResponse(question, context);

    // Store the interaction
    await client.db().collection("tutor_interactions").insertOne({
      userId: session.user.id,
      question,
      response,
      createdAt: new Date(),
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json(
      { error: "Failed to get tutor response" },
      { status: 500 }
    );
  }
}
