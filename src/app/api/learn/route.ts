import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateSummary } from "@/lib/openai";
import { searchResources } from "@/lib/perplexity";
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

    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Generate summary and search resources in parallel
    const [summary, resources] = await Promise.all([
      generateSummary(topic),
      searchResources(topic),
    ]);

    // Store learning history
    const client = await clientPromise;
    await client.db().collection("learning_history").insertOne({
      userId: session.user.id,
      topic,
      summary,
      resources: resources.results,
      createdAt: new Date(),
    });

    return NextResponse.json({
      summary,
      resources: resources.results,
    });
  } catch (error) {
    console.error("Learning API error:", error);
    return NextResponse.json(
      { error: "Failed to generate learning content" },
      { status: 500 }
    );
  }
}
