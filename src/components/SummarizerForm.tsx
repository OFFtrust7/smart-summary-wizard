
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSummarizerForm } from '@/hooks/useSummarizerForm';
import SummaryInputField from '@/components/summarizer/SummaryInputField';
import SummaryLengthSelector from '@/components/summarizer/SummaryLengthSelector';
import UsageLimitIndicator from '@/components/summarizer/UsageLimitIndicator';
import FileAttachment from '@/components/summarizer/FileAttachment';

interface SummarizerFormProps {
  onSummarize: (summary: string) => void;
  setIsLoading: (loading: boolean) => void;
  inputType?: 'text' | 'url' | 'youtube';
  placeholder?: string;
  disabled?: boolean;
}

const SummarizerForm: React.FC<SummarizerFormProps> = ({ 
  onSummarize, 
  setIsLoading,
  inputType = 'text',
  placeholder,
  disabled = false
}) => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  const {
    text,
    setText,
    summaryLength,
    setSummaryLength,
    handleSubmit,
    getDefaultPlaceholder,
    remaining,
    limitReached
  } = useSummarizerForm({
    onSummarize,
    setIsLoading,
    inputType,
    attachedFiles
  });

  // Don't allow submissions if disabled or limit reached
  const isFormDisabled = disabled || limitReached;

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(files);
  };

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
            <UsageLimitIndicator 
              remaining={remaining}
              limitReached={limitReached}
            />
          </div>
        </div>
        
        <SummaryInputField
          inputType={inputType}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || getDefaultPlaceholder()}
          disabled={isFormDisabled}
        />
        
        <div className="mt-4">
          <FileAttachment
            onFileSelect={handleFileSelect}
            disabled={isFormDisabled}
          />
        </div>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <motion.div
          className="w-full sm:w-1/3" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SummaryLengthSelector
            value={summaryLength}
            onChange={setSummaryLength}
            disabled={isFormDisabled}
          />
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
            disabled={isFormDisabled}
          >
            {limitReached ? 'Upgrade to Continue' : 'Summarize'}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SummarizerForm;
