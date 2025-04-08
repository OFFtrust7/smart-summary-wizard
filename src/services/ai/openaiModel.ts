
import { AIModelAdapter, AIModelResponse, AIModelOptions } from './interface';

/**
 * OpenAI implementation for the AI Model Adapter
 * Uses the OpenAI API for text generation
 */
export class OpenAIModel implements AIModelAdapter {
  private apiKey: string;
  private model: string;
  
  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
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
      
      // Make API call with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: options.maxLength || 1000,
            temperature: options.temperature || 0.7,
            stream: options.stream || false
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          return {
            success: false,
            error: errorData.error?.message || `OpenAI API error: ${response.status}`
          };
        }

        const data = await response.json();
        
        return {
          success: true,
          text: data.choices[0]?.message?.content || ""
        };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error("OpenAI service error:", error);
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: "Request timed out. The OpenAI API took too long to respond."
        };
      } else {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred with OpenAI API"
        };
      }
    }
  }
}
