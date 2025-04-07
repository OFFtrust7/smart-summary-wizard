
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
      const response = await generateAIResponse(prompt);

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
        setError(response.error || "Failed to generate response");
        toast.error(response.error || "Failed to generate response");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to communicate with AI assistant";
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
