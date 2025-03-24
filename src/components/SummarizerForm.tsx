
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { summarizeText } from '@/services/summaryService';

interface SummarizerFormProps {
  onSummarize: (summary: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const SummarizerForm: React.FC<SummarizerFormProps> = ({ onSummarize, setIsLoading }) => {
  const [text, setText] = useState('');
  const [summaryLength, setSummaryLength] = useState('balanced');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const summary = await summarizeText(text, summaryLength);
      onSummarize(summary);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
          Enter text or paste URL
        </label>
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text or URL here..."
          className="min-h-[150px] resize-none transition-all duration-200 focus:shadow-md"
        />
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
          <Select value={summaryLength} onValueChange={setSummaryLength}>
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
          >
            Summarize
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SummarizerForm;
