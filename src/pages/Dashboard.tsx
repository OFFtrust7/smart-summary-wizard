
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Youtube } from 'lucide-react';
import HistoryPanel from '@/components/HistoryPanel';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TextSummaryTab from '@/components/dashboard/TextSummaryTab';
import UrlSummaryTab from '@/components/dashboard/UrlSummaryTab';
import YouTubeSummaryTab from '@/components/dashboard/YouTubeSummaryTab';
import { useSummary } from '@/hooks/useSummary';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [isPremium, setIsPremium] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'text');
  const [username, setUsername] = useState('User');
  const location = useLocation();
  const { toast } = useToast();
  
  const { isLimitReached, remainingUsage } = useUsageLimits();
  const { 
    summary, 
    setSummary, 
    isLoading, 
    setIsLoading, 
    handleTextSummarize, 
    handleUrlSummarize, 
    handleYouTubeSummarize 
  } = useSummary();
  
  // Check for payment success
  useEffect(() => {
    if (location.pathname === '/payment-success') {
      // Mark the user as premium
      localStorage.setItem('isPremium', 'true');
      toast({
        title: "Payment Successful!",
        description: "Welcome to Premium! You now have unlimited access to all features.",
        variant: "default",
      });
    }
  }, [location.pathname, toast]);
  
  // Check premium status and get user data
  useEffect(() => {
    // Check if user has premium status
    const premiumStatus = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premiumStatus);
    
    // Get username if available
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);
  
  // Set the active tab based on URL parameter
  useEffect(() => {
    if (tabFromUrl && ['text', 'url', 'youtube'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const toggleHistory = () => setShowHistory(!showHistory);

  return (
    <Layout>
      <div className="w-full px-4 py-8">
        <DashboardHeader 
          username={username} 
          isPremium={isPremium} 
          onToggleHistory={toggleHistory}
          showHistory={showHistory}
        />

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {showHistory ? (
            <HistoryPanel onClose={() => setShowHistory(false)} onSelectItem={setSummary} />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="text">
                  <FileText className="mr-2 h-4 w-4" />
                  Text {!isPremium && !isLimitReached('text') && <span className="ml-1 text-xs">({remainingUsage('text')})</span>}
                </TabsTrigger>
                <TabsTrigger value="url" disabled={!isPremium && isLimitReached('url')}>
                  <Upload className="mr-2 h-4 w-4" />
                  URL / PDF {!isPremium && !isLimitReached('url') && <span className="ml-1 text-xs">({remainingUsage('url')})</span>}
                </TabsTrigger>
                <TabsTrigger value="youtube" disabled={!isPremium && isLimitReached('youtube')}>
                  <Youtube className="mr-2 h-4 w-4" />
                  YouTube {!isPremium && !isLimitReached('youtube') && <span className="ml-1 text-xs">({remainingUsage('youtube')})</span>}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <TextSummaryTab 
                  summary={summary}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onSummarize={handleTextSummarize}
                  isPremium={isPremium}
                />
              </TabsContent>
              
              <TabsContent value="url">
                <UrlSummaryTab 
                  summary={summary}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onSummarize={handleUrlSummarize}
                  isPremium={isPremium}
                />
              </TabsContent>
              
              <TabsContent value="youtube">
                <YouTubeSummaryTab 
                  summary={summary}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onSummarize={handleYouTubeSummarize}
                  isPremium={isPremium}
                />
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
