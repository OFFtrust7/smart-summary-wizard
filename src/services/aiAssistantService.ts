
import { aiService } from './ai/aiService';
import { env } from '@/config/env';
import { getOpenAIResponse } from './openaiService';

/**
 * Service for interacting with the AI Assistant API
 * This is a wrapper around the aiService for backward compatibility
 */

// Default response when service is disabled
const DISABLED_RESPONSE = {
  success: false,
  error: "AI Assistant service is disabled",
  text: "I'm sorry, but the AI Assistant service is currently disabled. Please check your environment settings."
};

/**
 * Generate text using the AI Assistant API
 * @param prompt The user's prompt for the AI assistant
 * @returns A promise resolving to the AI response
 */
export async function generateAIResponse(prompt: string) {
  // Check if service is enabled
  if (!env.ENABLE_AI_ASSISTANT) {
    console.log("AI Assistant service is disabled");
    return DISABLED_RESPONSE;
  }

  // If we have an OpenAI API key, we can directly use it (prioritize this)
  if (env.OPENAI_API_KEY) {
    try {
      console.log("Using direct OpenAI integration with API key");
      const text = await getOpenAIResponse(prompt);
      return {
        success: true,
        text
      };
    } catch (error) {
      console.error("OpenAI direct integration error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error with OpenAI API",
        text: `Error with OpenAI API: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  }

  // Fall back to the AI service if no OpenAI key
  console.log("No OpenAI API key, falling back to backend API");
  return aiService.generateResponse(prompt);
}

/**
 * Configure the AI Assistant service with environment variables
 * This should be called when the application starts
 */
export function configureAIAssistantService(backendUrl: string, openaiApiKey?: string): void {
  if (!backendUrl && !openaiApiKey) {
    console.warn("AI Assistant service configuration warning: No backend URL or OpenAI API key provided, using mock responses");
    return;
  }
  
  // Configure the AI service
  aiService.configure(backendUrl, openaiApiKey);
  
  if (backendUrl) {
    console.log(`AI Assistant service configured with backend URL: ${backendUrl}`);
  }
  
  if (openaiApiKey) {
    console.log("AI Assistant service configured with OpenAI integration");
  }
}

/**
 * Configure OpenAI for the AI Assistant service
 * This can be called separately to set or update the OpenAI configuration
 */
export function configureOpenAI(apiKey: string, model?: string): void {
  if (!apiKey) {
    console.warn("OpenAI configuration failed: No API key provided");
    return;
  }
  
  aiService.configureOpenAI(apiKey, model);
}
