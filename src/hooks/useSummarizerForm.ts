
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
    // Store file content as is, without modifications
    setFileContent(content);
    setFileName(name);
    
    // For text input type, automatically set the content to the text field
    if (inputType === 'text') {
      if (content.startsWith('[PDF Document:')) {
        // For PDFs, don't auto-fill the text area
        toast.info(`PDF "${name}" attached. Content will be processed automatically.`);
      } else {
        // For text files, fill the textarea with the content
        setText(content);
        toast.success(`Content from "${name}" loaded for summarization`);
      }
    } else {
      toast.info(`File "${name}" attached for processing`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Decide what content to summarize (text input or file content)
    let contentToSummarize = text.trim();
    
    // If no text is entered, but file content is available, use that
    if (!contentToSummarize && fileContent) {
      contentToSummarize = fileContent;
    }
    
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
      // If this is URL or YouTube, we pass directly to the parent handler
      if ((inputType === 'url' || inputType === 'youtube') && text.trim()) {
        onSummarize(text);
        return;
      }
      
      // For text summarization, use the service
      if (!contentToSummarize) {
        toast.error("No content available to summarize");
        setIsLoading(false);
        return;
      }
      
      const summary = await summarizeText(contentToSummarize, summaryLength);
      onSummarize(summary);
      
      // Save to history with appropriate title
      let historyTitle = '';
      if (fileName) {
        historyTitle = `File: ${fileName.slice(0, 30)}${fileName.length > 30 ? '...' : ''}`;
      } else {
        historyTitle = `${inputType === 'text' ? 'Text' : 'URL'}: ${contentToSummarize.slice(0, 50)}${contentToSummarize.length > 50 ? '...' : ''}`;
      }
        
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
