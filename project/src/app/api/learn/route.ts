import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/openai";
import { searchResources } from "@/lib/perplexity";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    const [summary, resources] = await Promise.all([
      generateSummary(topic),
      searchResources(topic),
    ]);

    return NextResponse.json({ summary, resources });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate learning content" },
      { status: 500 }
    );
  }
}