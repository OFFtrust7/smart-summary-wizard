
import { aiService } from './ai/aiService';
import { env } from '@/config/env';
import { AIModelResponse } from './ai/interface';

/**
 * Service for interacting with the AI Assistant API
 * This is a wrapper around the aiService for backward compatibility
 */

// Default response when service is disabled
const DISABLED_RESPONSE: AIModelResponse = {
  success: false,
  error: "AI Assistant service is disabled",
  text: "I'm sorry, but the AI Assistant service is currently disabled. Please check your environment settings."
};

/**
 * Generate text using the AI Assistant API via backend
 * @param prompt The user's prompt for the AI assistant
 * @returns A promise resolving to the AI response
 */
export async function generateAIResponse(prompt: string): Promise<AIModelResponse> {
  // Check if service is enabled
  if (!env.ENABLE_AI_ASSISTANT) {
    console.log("AI Assistant service is disabled");
    return DISABLED_RESPONSE;
  }

  try {
    console.log("Using backend API for AI assistant");
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.error || 'Unknown error',
        text: `Error: ${errorData.error || 'Unknown error'}`
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      text: data.text 
    };
  } catch (error) {
    console.error("Error calling backend:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { 
      success: false, 
      error: errorMessage,
      text: `Error connecting to backend server: ${errorMessage}. Please make sure your backend is running.`
    };
  }
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
