
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';

const Index: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout>
      <Header />
      
      <motion.div 
        className="w-full max-w-3xl mx-auto mt-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SummarizerForm onSummarize={setSummary} setIsLoading={setIsLoading} />
        
        <SummaryResult summary={summary} isLoading={isLoading} />
        
        {!summary && !isLoading && (
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
