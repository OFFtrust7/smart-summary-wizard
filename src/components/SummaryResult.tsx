
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  // Function to format plain text with line breaks
  const formatPlainText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

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
  
  // Format content based on its type
  const renderContent = (content: string) => {
    // If content starts with PDF or file markers, extract readable text
    if (content.startsWith('[PDF Document:') || content.startsWith('[File:')) {
      const cleanContent = content.replace(/^\[(PDF Document|File|Image):[^\]]+\]\s*/i, '');
      return formatPlainText(cleanContent);
    }
    
    if (containsMarkdown(content)) {
      // For markdown content, preserve formatting with pre-wrap 
      return <div className="whitespace-pre-wrap">{content}</div>;
    } else {
      // Plain text rendering with line breaks
      return formatPlainText(content);
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
        
        <Card className="border rounded-lg p-0">
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] w-full overflow-auto">
              <div className="p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="prose prose-sm max-w-none"
                >
                  <div className="text-balance leading-relaxed">
                    {renderContent(summary)}
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SummaryResult;
