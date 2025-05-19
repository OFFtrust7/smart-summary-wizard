import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryResultProps {
  summary: string;
  isLoading: boolean;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ summary, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Summary copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <motion.div
        className="w-full neo-blur rounded-2xl p-6 md:p-8 mt-8 min-h-[200px] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="mt-4 text-muted-foreground">Generating your summary...</p>
        </div>
      </motion.div>
    );
  }

  if (!summary) return null;

  // Function to help detect if the content appears to be markdown
  const containsMarkdown = (text: string): boolean => {
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#+\s/m,         // Headers
      /\*\*.*\*\*/,     // Bold
      /\*.*\*/,         // Italic
      /^>\s/m,          // Blockquotes
      /^-\s/m,          // Unordered lists
      /^[0-9]+\.\s/m,   // Ordered lists
      /\[.*\]\(.*\)/,   // Links
      /^```/m,          // Code blocks
    ];
    
    return markdownPatterns.some(pattern => pattern.test(text));
  };
  
  // Ensure plain text formatting when needed
  const formatContent = (content: string) => {
    if (containsMarkdown(content)) {
      // If the content appears to be markdown, preserve it
      return content;
    } else {
      // Otherwise, add line breaks for better readability
      return content.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="summary"
        className="w-full neo-blur rounded-2xl p-6 md:p-8 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Summary</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="prose prose-sm max-w-none"
          >
            <div className="text-balance leading-relaxed whitespace-pre-wrap">
              {formatContent(summary)}
            </div>
          </motion.div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};

export default SummaryResult;
