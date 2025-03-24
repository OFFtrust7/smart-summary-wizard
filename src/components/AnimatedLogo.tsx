
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo: React.FC = () => {
  return (
    <motion.div 
      className="relative w-16 h-16 flex items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2 
      }}
    >
      <motion.div 
        className="absolute w-full h-full rounded-xl bg-primary/10"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          rotate: { duration: 12, ease: "linear", repeat: Infinity },
          scale: { duration: 3, ease: "easeInOut", repeat: Infinity }
        }}
      />
      
      <motion.div 
        className="absolute w-10 h-10 rounded-lg bg-primary/20"
        animate={{ 
          rotate: [0, -360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 10, ease: "linear", repeat: Infinity },
          scale: { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.5 }
        }}
      />
      
      <motion.div 
        className="relative w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center font-bold z-10"
        animate={{ 
          scale: [1, 1.15, 1]
        }}
        transition={{ 
          duration: 5, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
      >
        S
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLogo;
