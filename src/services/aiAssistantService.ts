
import { aiService } from './ai/aiService';
import { env } from '@/config/env';

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

  return aiService.generateResponse(prompt);
}

/**
 * Configure the AI Assistant service with environment variables
 * This should be called when the application starts
 */
export function configureAIAssistantService(backendUrl: string): void {
  if (!backendUrl) {
    console.warn("AI Assistant service configuration warning: No backend URL provided, using mock responses");
    return;
  }
  
  // Configure the AI service
  aiService.configure(backendUrl);
  console.log(`AI Assistant service configured with backend URL: ${backendUrl}`);
}
