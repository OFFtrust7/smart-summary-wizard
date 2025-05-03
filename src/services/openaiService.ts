
import { env } from '@/config/env';

/**
 * OpenAI Service for direct API calls
 */
export async function getOpenAIResponse(prompt: string) {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const model = env.OPENAI_MODEL || "gpt-4o";
    console.log(`Making OpenAI API request with model: ${model}`);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      }),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(20000) // 20 second timeout
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: { message: `API error: ${response.status} ${response.statusText}` } }));
      console.error("OpenAI API error:", data.error);
      
      // Handle different error types with more specific messages
      if (response.status === 401) {
        throw new Error("Invalid OpenAI API key. Please check your API key and try again.");
      } else if (response.status === 429) {
        throw new Error("OpenAI API rate limit exceeded or insufficient quota. Please check your billing status.");
      } else {
        throw new Error(data.error?.message || "Failed to fetch AI response.");
      }
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI service error:", error);
    throw error;
  }
}
