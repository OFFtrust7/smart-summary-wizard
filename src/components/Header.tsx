
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="w-full flex flex-col items-center justify-center pt-10 pb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatedLogo />
      
      <motion.h1 
        className="text-4xl font-bold tracking-tight mt-6 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        Smart Summary
      </motion.h1>
      
      <motion.p 
        className="text-muted-foreground mt-3 max-w-md text-center text-balance px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        AI-powered summarization for text, articles, and documents
      </motion.p>
    </motion.header>
  );
};

export default Header;
