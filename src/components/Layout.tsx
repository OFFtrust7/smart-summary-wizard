
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div 
      className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/30 overflow-hidden flex flex-col items-center justify-start pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 40, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute top-[60%] -right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 35, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 50, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      <main className="w-full max-w-7xl flex-1 flex flex-col items-center z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-background/60 backdrop-blur-sm border-t border-border/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold text-sm">Smart Summary</h3>
            <p className="text-xs text-muted-foreground mt-1">© 2023 All rights reserved</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Layout;
