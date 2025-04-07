
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { useAIAssistant, Message } from '@/hooks/useAIAssistant';
import { Send, RefreshCw, Bot, User } from 'lucide-react';

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${message.role === 'assistant' ? 'items-start' : 'items-start'}`}
    >
      <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ${
        message.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary-foreground'
      }`}>
        {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
      </div>
      
      <div className="flex-1">
        <div className={`p-3 rounded-lg ${
          message.role === 'assistant' ? 'bg-card border' : 'bg-muted'
        }`}>
          <div className="whitespace-pre-wrap text-sm">
            {message.content}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

const AIAssistant: React.FC = () => {
  const { messages, isLoading, sendMessage, clearConversation } = useAIAssistant();
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      sendMessage(prompt);
      setPrompt('');
    }
  };

  return (
    <motion.div
      className="w-full neo-blur rounded-2xl p-6 md:p-8 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Bot size={20} className="text-primary" />
          AI Assistant
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={clearConversation}
        >
          <RefreshCw size={16} />
          <span className="ml-2">New Chat</span>
        </Button>
      </div>

      {messages.length > 0 ? (
        <Card className="border mb-4">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Bot size={40} className="mx-auto mb-3 text-muted-foreground/50" />
          <p>Ask me anything or type a prompt for text generation.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message or prompt here..."
          className="min-h-[80px] resize-none pr-16"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <Button
          className="absolute bottom-2 right-2"
          size="sm"
          type="submit"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </motion.div>
  );
};

export default AIAssistant;
