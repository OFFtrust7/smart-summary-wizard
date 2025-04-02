
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { summarizeText } from '@/services/summaryService';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { AlertCircle } from 'lucide-react';

interface SummarizerFormProps {
  onSummarize: (summary: string) => void;
  setIsLoading: (loading: boolean) => void;
  inputType?: 'text' | 'url' | 'youtube';
  placeholder?: string;
  disabled?: boolean; // Added the disabled prop
}

const SummarizerForm: React.FC<SummarizerFormProps> = ({ 
  onSummarize, 
  setIsLoading,
  inputType = 'text',
  placeholder
}) => {
  const [text, setText] = useState('');
  const [summaryLength, setSummaryLength] = useState('balanced');
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

  const remaining = remainingUsage(inputType);
  const limitReached = isLimitReached(inputType);

  return (
    <motion.form 
      className="w-full neo-blur rounded-2xl p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="text-input" className="block text-sm font-medium text-foreground">
            {inputType === 'text' ? 'Enter text' : 
            inputType === 'url' ? 'Enter URL' : 'Enter YouTube URL'}
          </label>
          
          {/* Free plan usage indicator */}
          <div className={`text-xs ${limitReached ? 'text-destructive' : 'text-muted-foreground'}`}>
            {limitReached ? (
              <span className="flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Limit reached
              </span>
            ) : (
              `${remaining} remaining today`
            )}
          </div>
        </div>
        
        {inputType === 'text' ? (
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder || getDefaultPlaceholder()}
            className="min-h-[150px] resize-none transition-all duration-200 focus:shadow-md"
            disabled={limitReached}
          />
        ) : (
          <Input
            id="url-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder || getDefaultPlaceholder()}
            className="transition-all duration-200 focus:shadow-md"
            disabled={limitReached}
          />
        )}
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <motion.div
          className="w-full sm:w-1/3" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label htmlFor="summary-length" className="block text-sm font-medium text-foreground mb-2">
            Summary Length
          </label>
          <Select value={summaryLength} onValueChange={setSummaryLength} disabled={limitReached}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Summary length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="w-full sm:w-2/3 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-primary h-10 transition-all duration-300 hover:shadow-lg hover:bg-primary/90"
            disabled={limitReached}
          >
            {limitReached ? 'Upgrade to Continue' : 'Summarize'}
          </Button>
        </motion.div>
      </div>

      {limitReached && (
        <motion.div 
          className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          You've reached your free daily limit for {inputType} summaries.
          <Button 
            variant="link" 
            className="mx-auto block"
            onClick={() => window.location.href = '/pricing'}
          >
            Upgrade for unlimited access
          </Button>
        </motion.div>
      )}
    </motion.form>
  );
};

export default SummarizerForm;
