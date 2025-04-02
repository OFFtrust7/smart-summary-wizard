
import { useState } from 'react';
import { toast } from 'sonner';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { summarizeText } from '@/services/summaryService';

type SummaryLength = 'concise' | 'balanced' | 'detailed';
type InputType = 'text' | 'url' | 'youtube';

interface UseSummarizerFormProps {
  onSummarize: (summary: string) => void;
  setIsLoading: (loading: boolean) => void;
  inputType: InputType;
}

export function useSummarizerForm({ 
  onSummarize, 
  setIsLoading, 
  inputType 
}: UseSummarizerFormProps) {
  const [text, setText] = useState('');
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('balanced');
  const { incrementUsage, remainingUsage, isLimitReached } = useUsageLimits();

  const getDefaultPlaceholder = () => {
    switch(inputType) {
      case 'url':
        return 'Enter URL to summarize...';
      case 'youtube':
        return 'Enter YouTube URL to summarize...';
      default:
        return 'Paste your text here...';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error(`Please enter ${inputType === 'text' ? 'some text' : 'a valid URL'} to summarize`);
      return;
    }

    // Check usage limits before proceeding
    if (!incrementUsage(inputType)) {
      // If incrementUsage returns false, the limit is reached and a toast is already shown
      return;
    }
    
    setIsLoading(true);
    
    try {
      // If this is URL or YouTube, we pass directly to the parent handler
      if (inputType === 'url' || inputType === 'youtube') {
        onSummarize(text);
        return;
      }
      
      // For text summarization, use the service
      const summary = await summarizeText(text, summaryLength);
      onSummarize(summary);
      
      // Save to history
      const newEntry = {
        id: Date.now(),
        type: inputType,
        title: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        content: summary,
        date: new Date().toISOString()
      };
      
      const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
      localStorage.setItem('summaryHistory', JSON.stringify([newEntry, ...history]));
      
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    text,
    setText,
    summaryLength,
    setSummaryLength,
    handleSubmit,
    getDefaultPlaceholder,
    remaining: remainingUsage(inputType),
    limitReached: isLimitReached(inputType)
  };
}
