
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
    console.log('File content received:', { name, contentLength: content.length, preview: content.substring(0, 100) });
    
    // Store file content and name
    setFileContent(content);
    setFileName(name);
    
    // Always put the full file content directly in the text area for user to see
    setText(content);
    toast.success(`File "${name}" content loaded. You can review and edit before summarizing.`);
  };
  
  // Helper function to ensure text is clean plain text
  const ensureCleanText = (text: string): string => {
    try {
      // Remove any HTML tags that might be present
      let cleanText = text.replace(/<[^>]*>/g, '');
      
      // Remove any non-printable characters except line breaks and spaces
      cleanText = cleanText.replace(/[^\x20-\x7E\n\r\t]/g, '');
      
      // Remove any repeated line breaks
      cleanText = cleanText.replace(/(\r?\n){3,}/g, '\n\n');
      
      // Ensure consistent line breaks
      cleanText = cleanText.replace(/\r\n/g, '\n');
      
      // Replace any remaining non-ASCII characters
      cleanText = cleanText.replace(/[^\x00-\x7F]/g, '');
      
      // Decode HTML entities
      cleanText = cleanText.replace(/&amp;/g, '&')
                           .replace(/&lt;/g, '<')
                           .replace(/&gt;/g, '>')
                           .replace(/&quot;/g, '"')
                           .replace(/&#039;/g, "'")
                           .replace(/&nbsp;/g, ' ');
      
      return cleanText;
    } catch (error) {
      console.error('Error cleaning text:', error);
      return text; // Return original if cleaning fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use the text content directly (whether it's from file or manually entered)
    const contentToSummarize = text.trim();
    
    // Check if we have content to summarize
    if (!contentToSummarize && attachedFiles.length === 0) {
      toast.error(`Please enter ${inputType === 'text' ? 'some text' : 'a valid URL'} or attach a file to summarize`);
      return;
    }
    
    // If we have attachedFiles but no content yet, wait for processing
    if (!contentToSummarize && attachedFiles.length > 0) {
      toast.info("Please wait for file processing to complete...");
      return;
    }

    // Check usage limits before proceeding
    if (!incrementUsage(inputType)) {
      return;
    }
    
    setIsLoading(true);
    toast.info("Generating summary...");
    
    try {
      // If this is URL or YouTube, we pass directly to the parent handler
      if ((inputType === 'url' || inputType === 'youtube') && contentToSummarize && !fileName) {
        onSummarize(contentToSummarize);
        return;
      }
      
      // For text summarization, use the service
      if (!contentToSummarize) {
        toast.error("No content available to summarize");
        setIsLoading(false);
        return;
      }
      
      console.log('Content to summarize:', { length: contentToSummarize.length, preview: contentToSummarize.substring(0, 200) });
      
      // Clean any potential HTML from the content before sending for summarization
      const cleanContent = ensureCleanText(contentToSummarize);
      
      const summary = await summarizeText(cleanContent, summaryLength);
      onSummarize(summary);
      
      // Save to history with appropriate title
      let historyTitle = '';
      if (fileName) {
        historyTitle = `File: ${fileName.slice(0, 30)}${fileName.length > 30 ? '...' : ''}`;
      } else {
        historyTitle = `${inputType === 'text' ? 'Text' : 'URL'}: ${cleanContent.slice(0, 50)}${cleanContent.length > 50 ? '...' : ''}`;
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
      
      // Clear the state after successful summarization
      setText('');
      setFileContent(null);
      setFileName(null);
      
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
