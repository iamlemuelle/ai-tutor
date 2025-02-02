import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(topic: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an expert tutor. Create a clear, concise summary of the following topic:",
      },
      {
        role: "user",
        content: topic,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content || "Unable to generate summary";
}

export async function generateQuiz(topic: string): Promise<any> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Create a multiple-choice quiz with 5 questions about the following topic. Format the response as JSON with the following structure: { questions: [{ question: string, options: string[], correctAnswer: number }] }",
      },
      {
        role: "user",
        content: topic,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function getTutorResponse(
  question: string,
  context: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful and knowledgeable tutor. Provide clear, detailed explanations.",
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content || "Unable to generate response";
}
