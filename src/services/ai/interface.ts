
/**
 * Core interfaces for the AI Assistant service
 */

export interface AIModelResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export interface AIModelOptions {
  maxLength?: number;
  temperature?: number;
  stream?: boolean;
}

export interface AIModelAdapter {
  generateResponse(prompt: string, options?: AIModelOptions): Promise<AIModelResponse>;
}
