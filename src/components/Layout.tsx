
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/50 overflow-hidden flex flex-col items-center justify-start pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 20, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute top-[60%] -right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 25, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
      </div>
      
      <main className="w-full max-w-4xl px-4 flex-1 flex flex-col items-center z-10">
        {children}
      </main>
    </motion.div>
  );
};

export default Layout;
