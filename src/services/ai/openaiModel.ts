
import { AIModelAdapter, AIModelResponse, AIModelOptions } from './interface';
import { getOpenAIResponse } from '../openaiService';

/**
 * OpenAI implementation for the AI Model Adapter
 * Uses the OpenAI API for text generation
 */
export class OpenAIModel implements AIModelAdapter {
  private apiKey: string;
  private model: string;
  
  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(prompt: string, options: AIModelOptions = {}): Promise<AIModelResponse> {
    try {
      // Return early if no API key is set
      if (!this.apiKey) {
        console.warn("OpenAI API key is not configured");
        return {
          success: false,
          error: "OpenAI API key is not configured"
        };
      }

      console.log(`Making OpenAI API request with model: ${this.model}`);
      
      try {
        const response = await getOpenAIResponse(prompt);
        
        return {
          success: true,
          text: response
        };
      } catch (fetchError) {
        throw fetchError;
      }
    } catch (error) {
      console.error("OpenAI service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred with OpenAI API"
      };
    }
  }
}
