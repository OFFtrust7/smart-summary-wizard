
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { aiService } from '@/services/ai/aiService';
import { env } from '@/config/env';

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
      const response = await aiService.generateResponse(prompt, {
        temperature: 0.7,  // Controls randomness: lower is more deterministic
        maxLength: 2000    // Maximum length of the response
      });
      
      console.log("AI assistant response:", response);

      // Always show a response message, even if there's an error
      let responseContent: string;
      
      if (response.success && response.text) {
        responseContent = response.text;
      } else {
        const errorMessage = response.error || "Failed to generate response";
        setError(errorMessage);
        console.error("AI Assistant error:", errorMessage);
        
        // In dev mode or with no API URL, we'll already have a fallback response from the service
        // In other error cases, show an error message in the chat
        if (!env.isDevelopment() && env.BACKEND_API_URL) {
          responseContent = `I'm sorry, but I encountered an issue: ${errorMessage}. Please try again later.`;
          toast.error("AI Assistant error: " + errorMessage);
        } else {
          responseContent = response.text || `I'm sorry, but I encountered an issue. Please try again later.`;
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
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again later.`,
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
