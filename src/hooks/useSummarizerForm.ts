
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
      } else if (content.startsWith('[Image:') || content.startsWith('[File:')) {
        // For non-text files, display a processing message
        toast.info(`File "${name}" attached. Content will be processed automatically.`);
        setText(`Processing ${name}...`);
      } else {
        // For text files, fill the textarea with the content
        // Make sure the content is properly encoded as plain text
        const cleanedContent = ensureCleanText(content);
        setText(cleanedContent);
        toast.success(`Content from "${name}" loaded for summarization`);
      }
    } else {
      toast.info(`File "${name}" attached for processing`);
    }
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
    
    // Decide what content to summarize (text input or file content)
    let contentToSummarize = text.trim();
    
    // If no text is entered, but file content is available, use that
    if (!contentToSummarize && fileContent) {
      contentToSummarize = fileContent;
    }
    
    // Allow submission with attached files, even if no text is provided
    if (!contentToSummarize && attachedFiles.length === 0) {
      toast.error(`Please enter ${inputType === 'text' ? 'some text' : 'a valid URL'} or attach a file to summarize`);
      return;
    }
    
    // If we have attachedFiles but no content yet, we should process them
    if (!contentToSummarize && attachedFiles.length > 0) {
      // For file-only submissions without text content
      toast.info("Processing attached file...");
      
      // Set a placeholder for file processing and show file name
      const fileName = attachedFiles[0].name;
      contentToSummarize = `[Processing file: ${fileName}]`;
      
      // Update the text area to show processing message
      setText(`Processing ${fileName}...`);
    }

    // Check usage limits before proceeding
    if (!incrementUsage(inputType)) {
      // If incrementUsage returns false, the limit is reached and a toast is already shown
      return;
    }
    
    setIsLoading(true);
    toast.info("Generating summary...");
    
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
