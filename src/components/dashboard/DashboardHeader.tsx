
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUp, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  username: string;
  isPremium: boolean;
  onToggleHistory: () => void;
  showHistory: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  username, 
  isPremium, 
  onToggleHistory, 
  showHistory 
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="flex justify-between items-center mb-8 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold">Welcome, {username}</h1>
        <p className="text-muted-foreground mt-1">Access all your SnapSummary tools</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleHistory}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          History
        </Button>
        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
          {isPremium ? 'Premium Plan' : 'Free Plan'}
        </span>
        {!isPremium && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/pricing')}
            className="ml-2"
          >
            <ArrowUp className="mr-1 h-3 w-3" />
            Upgrade
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
