
import { useState } from 'react';
import { toast } from 'sonner';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { generateYouTubeSummary } from '@/services/youtubeService';

interface SummaryHistory {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
}

export function useSummary() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { incrementUsage } = useUsageLimits();

  // Function to handle text summarization
  const handleTextSummarize = async (text: string) => {
    // Check if free limit is reached
    if (!incrementUsage('text')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple summary logic (this would be replaced with a real API call)
      const words = text.split(' ');
      const summaryLength = Math.max(Math.floor(words.length * 0.3), 10);
      const summaryText = words.slice(0, summaryLength).join(' ') + '...';
      
      setSummary(summaryText);
      
      // Add to history
      addToHistory('text', `Text Summary ${new Date().toLocaleTimeString()}`, summaryText);
      
    } catch (error) {
      toast.error("Failed to summarize text");
      console.error("Text summarization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle URL summarization logic
  const handleUrlSummarize = async (url: string) => {
    // Check if free limit is reached
    if (!incrementUsage('url')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate URL content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      const extractedText = `This is the extracted content from ${url}. In a real application, this would be the actual content from the webpage.`;
      setSummary(extractedText);
      
      // Add to history
      addToHistory('url', `URL: ${url}`, extractedText);
      
    } catch (error) {
      toast.error("Failed to extract content from URL");
      console.error("URL extraction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle YouTube summarization logic
  const handleYouTubeSummarize = async (youtubeUrl: string) => {
    // Check if free limit is reached
    if (!incrementUsage('youtube')) {
      return;
    }
    
    if (!youtubeUrl.includes('youtube.com/') && !youtubeUrl.includes('youtu.be/')) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    
    setIsLoading(true);
    try {
      // Extract video ID for display in history
      const videoId = youtubeUrl.includes('v=') 
        ? youtubeUrl.split('v=')[1].split('&')[0]
        : youtubeUrl.split('/').pop();
      
      // Call the actual API service
      const summaryResult = await generateYouTubeSummary(youtubeUrl);
      
      if (summaryResult.success) {
        setSummary(summaryResult.script);
        
        // Add to history
        addToHistory('youtube', `YouTube: ${videoId}`, summaryResult.script);
      } else {
        toast.error(summaryResult.error || "Failed to summarize YouTube video");
      }
      
    } catch (error) {
      toast.error("Failed to summarize YouTube video");
      console.error("YouTube summarization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to add items to history
  const addToHistory = (type: string, title: string, content: string) => {
    const newEntry: SummaryHistory = {
      id: Date.now(),
      type,
      title,
      content,
      date: new Date().toISOString()
    };
    
    const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
    localStorage.setItem('summaryHistory', JSON.stringify([newEntry, ...history]));
  };

  return {
    summary,
    setSummary,
    isLoading,
    setIsLoading,
    handleTextSummarize,
    handleUrlSummarize,
    handleYouTubeSummarize
  };
}
