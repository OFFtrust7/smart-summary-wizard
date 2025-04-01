
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Define the limits for the free plan
const FREE_PLAN_LIMITS = {
  text: 10,    // 10 text summaries per day
  url: 3,      // 3 URL/PDF summaries per day
  youtube: 1   // 1 YouTube summary per day
};

interface UsageCounts {
  text: number;
  url: number;
  youtube: number;
}

interface UsageLimitsContextType {
  usage: UsageCounts;
  incrementUsage: (type: 'text' | 'url' | 'youtube') => boolean;
  resetUsage: () => void;
  isLimitReached: (type: 'text' | 'url' | 'youtube') => boolean;
  remainingUsage: (type: 'text' | 'url' | 'youtube') => number;
}

const UsageLimitsContext = createContext<UsageLimitsContextType | null>(null);

export function UsageLimitsProvider({ children }: { children: React.ReactNode }) {
  const [usage, setUsage] = useState<UsageCounts>(() => {
    // Try to load from localStorage with daily reset
    const storedUsage = localStorage.getItem('summaryUsage');
    const storedDate = localStorage.getItem('summaryUsageDate');
    const today = new Date().toDateString();
    
    // If it's a new day, reset the counts
    if (storedDate !== today) {
      return { text: 0, url: 0, youtube: 0 };
    }
    
    return storedUsage ? JSON.parse(storedUsage) : { text: 0, url: 0, youtube: 0 };
  });

  // Save to localStorage whenever usage changes
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('summaryUsage', JSON.stringify(usage));
    localStorage.setItem('summaryUsageDate', today);
  }, [usage]);

  const incrementUsage = (type: 'text' | 'url' | 'youtube'): boolean => {
    // Check if limit is reached
    if (usage[type] >= FREE_PLAN_LIMITS[type]) {
      // Show toast notification about limit
      toast.error(`Free plan limit reached for ${type} summaries. Upgrade for unlimited usage!`, {
        duration: 5000,
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/pricing'
        }
      });
      return false;
    }

    setUsage(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    return true;
  };

  const resetUsage = () => {
    setUsage({ text: 0, url: 0, youtube: 0 });
  };

  const isLimitReached = (type: 'text' | 'url' | 'youtube'): boolean => {
    return usage[type] >= FREE_PLAN_LIMITS[type];
  };

  const remainingUsage = (type: 'text' | 'url' | 'youtube'): number => {
    return Math.max(0, FREE_PLAN_LIMITS[type] - usage[type]);
  };

  const value = {
    usage,
    incrementUsage,
    resetUsage,
    isLimitReached,
    remainingUsage
  };

  return (
    <UsageLimitsContext.Provider value={value}>
      {children}
    </UsageLimitsContext.Provider>
  );
}

export const useUsageLimits = () => {
  const context = useContext(UsageLimitsContext);
  if (!context) {
    throw new Error('useUsageLimits must be used within a UsageLimitsProvider');
  }
  return context;
};
