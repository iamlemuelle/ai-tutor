import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateFlashcards } from "@/lib/openai";
import { ObjectId } from "mongodb";
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

    const { topic, cardCount } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const flashcards = await generateFlashcards(topic, cardCount);

    // Store flashcards in database
    const client = await clientPromise;
    const result = await client
      .db()
      .collection("flashcards")
      .insertOne({
        userId: new ObjectId(session.user.id),
        topic,
        flashcards: flashcards.flashcards,
        createdAt: new Date(),
      });

    return NextResponse.json({
      id: result.insertedId,
      ...flashcards,
    });
  } catch (error) {
    console.error("Flashcards API error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
