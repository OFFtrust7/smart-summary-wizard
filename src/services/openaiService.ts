
import { env } from '@/config/env';

/**
 * OpenAI Service for direct API calls
 */
export async function getOpenAIResponse(prompt: string) {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (response.ok) {
      return data.choices[0].message.content;
    } else {
      throw new Error(data.error?.message || "Failed to fetch AI response.");
    }
  } catch (error) {
    console.error("OpenAI service error:", error);
    throw error;
  }
}
