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

export async function generateQuiz(topic: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are a quiz generator. Create a multiple-choice quiz with 5 questions.",
        },
        {
          role: "user",
          content: `Create a quiz about ${topic}. Format your response as a valid JSON string containing an object with a 'questions' array. Each question should have: 'question' (string), 'options' (array of 4 strings), and 'correctAnswer' (number 0-3 indicating the correct option index).`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedQuiz = JSON.parse(content);

    // Validate the response structure
    if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions)) {
      throw new Error("Invalid quiz format received");
    }

    return parsedQuiz;
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz");
  }
}

export async function generateFlashcards(
  topic: string,
  cardCount: number = 10
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: `You are a flashcard generator. Create ${cardCount} comprehensive flashcards that cover key concepts.`,
        },
        {
          role: "user",
          content: `Create ${cardCount} flashcards about ${topic}. Return only a JSON object with a 'flashcards' array. Each flashcard should have 'front' (question/term) and 'back' (answer/definition) properties.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedFlashcards = JSON.parse(content);

    if (
      !parsedFlashcards.flashcards ||
      !Array.isArray(parsedFlashcards.flashcards)
    ) {
      throw new Error("Invalid flashcards format received");
    }

    // Validate each flashcard has required properties
    for (const card of parsedFlashcards.flashcards) {
      if (!card.front || !card.back) {
        throw new Error("Invalid flashcard format: missing front or back");
      }
    }

    return parsedFlashcards;
  } catch (error) {
    console.error("Flashcard generation error:", error);
    throw new Error("Failed to generate flashcards");
  }
}

export async function getTutorResponse(
  question: string,
  context: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
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
