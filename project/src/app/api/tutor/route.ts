import { NextResponse } from "next/server";
import { getTutorResponse } from "@/lib/openai";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { question, userId } = await req.json();
    
    // Get user's learning history for context
    const client = await clientPromise;
    const history = await client
      .db()
      .collection("learning_history")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const context = history
      .map((item) => `Topic: ${item.topic}\nSummary: ${item.summary}`)
      .join("\n\n");

    const response = await getTutorResponse(question, context);

    // Store the interaction
    await client.db().collection("tutor_interactions").insertOne({
      userId,
      question,
      response,
      createdAt: new Date(),
    });

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get tutor response" },
      { status: 500 }
    );
  }
}