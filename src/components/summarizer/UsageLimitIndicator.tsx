
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface UsageLimitIndicatorProps {
  remaining: number;
  limitReached: boolean;
}

const UsageLimitIndicator: React.FC<UsageLimitIndicatorProps> = ({
  remaining,
  limitReached
}) => {
  if (!limitReached) {
    return (
      <div className={`text-xs text-muted-foreground`}>
        {`${remaining} remaining today`}
      </div>
    );
  }

  return (
    <>
      <span className="flex items-center text-xs text-destructive">
        <AlertCircle size={14} className="mr-1" />
        Limit reached
      </span>
      <motion.div 
        className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        You've reached your free daily limit.
        <Button 
          variant="link" 
          className="mx-auto block"
          onClick={() => window.location.href = '/pricing'}
        >
          Upgrade for unlimited access
        </Button>
      </motion.div>
    </>
  );
};

export default UsageLimitIndicator;
