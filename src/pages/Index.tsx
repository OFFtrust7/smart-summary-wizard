
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import AIAssistant from '@/components/AIAssistant';
import { env } from '@/config/env';

const Index: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Check if AI Assistant is enabled via env config
  useEffect(() => {
    if (!env.ENABLE_AI_ASSISTANT) {
      setShowAIAssistant(false);
    }
  }, []);

  return (
    <Layout>
      <Header />
      
      <motion.div 
        className="w-full max-w-3xl mx-auto mt-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {env.ENABLE_AI_ASSISTANT && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              {showAIAssistant ? 'Hide AI Assistant' : 'Show AI Assistant'}
            </button>
          </div>
        )}
        
        <SummarizerForm onSummarize={setSummary} setIsLoading={setIsLoading} />
        
        <SummaryResult summary={summary} isLoading={isLoading} />
        
        {showAIAssistant && env.ENABLE_AI_ASSISTANT && <AIAssistant />}
        
        {!summary && !isLoading && !showAIAssistant && (
          <motion.div 
            className="mt-16 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-balance">
              Enter your text or URL above and click "Summarize" to get started.
            </p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Index;
