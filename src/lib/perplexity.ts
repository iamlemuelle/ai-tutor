import OpenAI from "openai";

interface PerplexityResponse {
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    reference: string; // Added field for the source or reference
  }>;
}

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("Missing PERPLEXITY_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

export async function searchResources(
  query: string
): Promise<PerplexityResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides learning resources. For the given topic, return a list of 5 high-quality learning resources with their titles, URLs, brief descriptions, and their source references.",
        },
        {
          role: "user",
          content: `Find learning resources about: ${query}`,
        },
      ],
    });

    // Check if the response content is valid
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from the API");
    }

    // Parse the plain text response manually
    const results = content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [title, url, snippet, reference] = line
          .split("|")
          .map((part) => part.trim());
        return { title, url, snippet, reference };
      });

    return { results };
  } catch (error) {
    console.error("Perplexity API error:", error);
    throw new Error("Failed to fetch learning resources");
  }
}
