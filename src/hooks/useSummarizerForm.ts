
import { useState } from 'react';
import { toast } from 'sonner';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { summarizeText } from '@/services/summaryService';

export type SummaryLength = 'concise' | 'balanced' | 'detailed';
export type InputType = 'text' | 'url' | 'youtube';

interface UseSummarizerFormProps {
  onSummarize: (summary: string) => void;
  setIsLoading: (loading: boolean) => void;
  inputType: InputType;
  attachedFiles?: File[];
}

export function useSummarizerForm({ 
  onSummarize, 
  setIsLoading, 
  inputType,
  attachedFiles = []
}: UseSummarizerFormProps) {
  const [text, setText] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('balanced');
  const { incrementUsage, remainingUsage, isLimitReached } = useUsageLimits();

  const getDefaultPlaceholder = () => {
    switch(inputType) {
      case 'url':
        return 'Enter URL to summarize or attach a file...';
      case 'youtube':
        return 'Enter YouTube URL to summarize...';
      default:
        return 'Paste your text here or attach a file...';
    }
  };

  const handleFileContent = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
    
    // For text input type, automatically set the content to the text field
    if (inputType === 'text') {
      setText(content);
      toast.success(`Content from "${name}" loaded for summarization`);
    } else {
      toast.info(`File "${name}" attached for processing`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use fileContent if available and no text is entered
    const contentToSummarize = text.trim() || fileContent;
    
    if (!contentToSummarize && attachedFiles.length === 0) {
      toast.error(`Please enter ${inputType === 'text' ? 'some text' : 'a valid URL'} or attach a file to summarize`);
      return;
    }

    // Check usage limits before proceeding
    if (!incrementUsage(inputType)) {
      // If incrementUsage returns false, the limit is reached and a toast is already shown
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Handle attachments if present
      if (attachedFiles.length > 0 && !text.trim() && !fileContent) {
        // For now, we'll just process the first file
        const file = attachedFiles[0];
        
        if (file.type.startsWith('image/')) {
          toast.info('Processing attached image...');
          // Image processing logic would go here
          toast.error('Image processing not yet implemented');
          setIsLoading(false);
          return;
        } else if (file.type === 'application/pdf') {
          toast.info('Processing PDF document...');
          // PDF processing logic would go here
          toast.error('PDF processing not yet implemented');
          setIsLoading(false);
          return;
        }
      }
      
      // If this is URL or YouTube, we pass directly to the parent handler
      if ((inputType === 'url' || inputType === 'youtube') && text.trim()) {
        onSummarize(text);
        return;
      }
      
      // For text summarization, use the service
      const textToSummarize = contentToSummarize || '';
      const summary = await summarizeText(textToSummarize, summaryLength);
      onSummarize(summary);
      
      // Save to history
      const historyTitle = fileName ? 
        `File: ${fileName.slice(0, 30)}${fileName.length > 30 ? '...' : ''}` : 
        `${inputType === 'text' ? 'Text' : 'URL'}: ${textToSummarize.slice(0, 50)}${textToSummarize.length > 50 ? '...' : ''}`;
        
      const newEntry = {
        id: Date.now(),
        type: inputType,
        title: historyTitle,
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
    fileContent,
    handleFileContent,
    summaryLength,
    setSummaryLength,
    handleSubmit,
    getDefaultPlaceholder,
    remaining: remainingUsage(inputType),
    limitReached: isLimitReached(inputType)
  };
}
