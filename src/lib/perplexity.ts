import OpenAI from "openai";

interface PerplexityResponse {
  results: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("Missing PERPLEXITY_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, "");
  } catch {
    return "Unknown Source";
  }
}

export async function searchResources(
  query: string
): Promise<PerplexityResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content: `You are an academic resource finder specializing in finding the highest quality educational content. 
Focus on resources from:
- Academic institutions (.edu domains)
- Government sources (.gov domains)
- Reputable organizations (.org domains)
- Peer-reviewed publications
- Official documentation
- Established educational platforms

For each resource, provide:
1. Title: The official title of the resource
2. URL: Direct link to the content
3. Description: A concise summary highlighting the academic value

Format each resource as:
Title: [Resource Title]
URL: [Resource URL]
Description: [Academic value and content summary]

Prioritize:
- Primary sources over secondary sources
- Peer-reviewed content
- Official documentation
- Academic publications
- Educational institution resources`,
        },
        {
          role: "user",
          content: `Find the 5 most academically rigorous and authoritative resources about: ${query}`,
        },
      ],
      temperature: 0.3, // Lower temperature for more focused results
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from Perplexity");
    }

    // Skip any introductory text and extract only the numbered list of resources
    const resourceSection = content.split(/\d+\.\s+/).slice(1); // Skip the first item (preamble)
    const results = resourceSection.map((resource) => {
      const titleMatch = resource.match(/Title:\s*([^\n]+)/);
      const urlMatch = resource.match(/URL:\s*([^\n]+)/);
      const descriptionMatch = resource.match(/Description:\s*([^\n]+)/);

      let url = urlMatch?.[1]?.trim() || "#";
      // Remove markdown formatting for URLs, e.g., [text](url) -> url
      const urlRegex = /\[.*?\]\((.*?)\)/;
      if (urlRegex.test(url)) {
        url = url.replace(urlRegex, "$1");
      }

      // Remove any leading "**" that might appear before the URL
      url = url.replace(/^\*\*/, "").trim();

      const title = titleMatch?.[1]?.trim();

      return {
        title: title || extractDomain(url),
        url,
        snippet: descriptionMatch?.[1]?.trim() || "No description available",
      };
    });

    return {
      results: results.slice(0, 5), // Ensure we only return 5 results
    };
  } catch (error) {
    console.error("Perplexity API error:", error);
    throw new Error("Failed to fetch learning resources");
  }
}
