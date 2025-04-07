
import { useState } from 'react';
import { toast } from 'sonner';
import { generateAIResponse } from '@/services/aiAssistantService';

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

  const sendMessage = async (prompt: string) => {
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
      const response = await generateAIResponse(prompt);
      console.log("AI assistant response:", response);

      if (response.success && response.text) {
        // Add assistant response to the conversation
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.text,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = response.error || "Failed to generate response";
        setError(errorMessage);
        console.error("AI Assistant error:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to communicate with AI assistant";
      console.error("AI Assistant catch error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation
  };
}
