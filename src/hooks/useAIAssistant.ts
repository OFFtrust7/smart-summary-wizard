
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { aiService } from '@/services/ai/aiService';
import { env } from '@/config/env';
import { generateAIResponse } from '@/services/aiAssistantService';
import { AIModelResponse } from '@/services/ai/interface';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error("Please enter a message");
      return;
    }

    // Add user message to the conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending message to AI assistant:", prompt);
      
      // Use the AI service to generate a response
      const response: AIModelResponse = await generateAIResponse(prompt);
      
      console.log("AI assistant response:", response);

      // Always show a response message, even if there's an error
      let responseContent: string;
      
      if (response.success && response.text) {
        responseContent = response.text;
      } else {
        // Safely access error property
        const errorMessage = response.error || "Failed to generate response";
        
        setError(errorMessage);
        console.error("AI Assistant error:", errorMessage);
        
        // Create user-friendly error message
        if (errorMessage.includes("Failed to connect")) {
          responseContent = `I'm sorry, but I couldn't connect to the backend server. Please make sure your backend server is running at http://localhost:3001.`;
          toast.error("Backend connection error: Cannot reach the AI service");
        } else if (env.OPENAI_API_KEY) {
          responseContent = `I'm sorry, but I encountered an issue: ${errorMessage}. Please verify your OpenAI API key is valid and has sufficient credits.`;
          toast.error("OpenAI API error: " + errorMessage);
        } else {
          responseContent = `I'm sorry, but I encountered an issue: ${errorMessage}. Please make sure your backend server is running correctly.`;
          toast.error("AI Assistant error: " + errorMessage);
        }
      }
      
      // Add assistant response to the conversation
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to communicate with AI assistant";
      console.error("AI Assistant catch error:", errorMessage);
      setError(errorMessage);
      
      // Add assistant error message to the conversation
      const errorResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please check if your backend server is running at http://localhost:3001.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponseMessage]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation
  };
}
