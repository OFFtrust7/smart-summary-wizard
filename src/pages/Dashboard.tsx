
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import HistoryPanel from '@/components/HistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, FileText, History, Upload, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium] = useState(false); // In a real app, this would come from auth state
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'text');
  const [username, setUsername] = useState('User');
  
  // Using the usage limits context
  const { 
    usage, 
    incrementUsage, 
    isLimitReached, 
    remainingUsage,
    getLimits
  } = useUsageLimits();
  
  const limits = getLimits();
  
  // Simulating getting user data after sign in
  useEffect(() => {
    // In a real app, this would come from auth state or API
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

  // Function to handle text summarization
  const handleTextSummarize = async (text: string) => {
    // Check if free limit is reached
    if (!isPremium && !incrementUsage('text')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple summary logic (this would be replaced with a real API call)
      const words = text.split(' ');
      const summaryLength = Math.max(Math.floor(words.length * 0.3), 10);
      const summaryText = words.slice(0, summaryLength).join(' ') + '...';
      
      setSummary(summaryText);
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        type: 'text',
        title: `Text Summary ${new Date().toLocaleTimeString()}`,
        content: summaryText,
        date: new Date().toISOString()
      };
      
      const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
      localStorage.setItem('summaryHistory', JSON.stringify([newEntry, ...history]));
      
    } catch (error) {
      toast.error("Failed to summarize text");
      console.error("Text summarization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle URL summarization logic
  const handleUrlSummarize = async (url: string) => {
    // Check if free limit is reached
    if (!isPremium && !incrementUsage('url')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate URL content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      const extractedText = `This is the extracted content from ${url}. In a real application, this would be the actual content from the webpage.`;
      setSummary(extractedText);
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        type: 'url',
        title: `URL: ${url}`,
        content: extractedText,
        date: new Date().toISOString()
      };
      
      const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
      localStorage.setItem('summaryHistory', JSON.stringify([newEntry, ...history]));
      
    } catch (error) {
      toast.error("Failed to extract content from URL");
      console.error("URL extraction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle YouTube summarization logic
  const handleYouTubeSummarize = async (youtubeUrl: string) => {
    // Check if free limit is reached
    if (!isPremium && !incrementUsage('youtube')) {
      return;
    }
    
    if (!youtubeUrl.includes('youtube.com/') && !youtubeUrl.includes('youtu.be/')) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    
    setIsLoading(true);
    try {
      // Extract video ID and simulate transcript extraction
      const videoId = youtubeUrl.includes('v=') 
        ? youtubeUrl.split('v=')[1].split('&')[0]
        : youtubeUrl.split('/').pop();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedTranscript = `This is a simulated transcript for YouTube video ID: ${videoId}. In a real application, this would be the actual transcript or summary of the video content.`;
      setSummary(simulatedTranscript);
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        type: 'youtube',
        title: `YouTube Video: ${videoId}`,
        content: simulatedTranscript,
        date: new Date().toISOString()
      };
      
      const history = JSON.parse(localStorage.getItem('summaryHistory') || '[]');
      localStorage.setItem('summaryHistory', JSON.stringify([newEntry, ...history]));
      
    } catch (error) {
      toast.error("Failed to summarize YouTube video");
      console.error("YouTube summarization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render usage limits for the active tab
  const renderUsageLimits = (type: 'text' | 'url' | 'youtube') => {
    if (isPremium) return null;
    
    return (
      <div className="mt-2 text-sm">
        <span className={isLimitReached(type) ? "text-destructive" : "text-muted-foreground"}>
          {remainingUsage(type)} of {limits[type]} free {type} summaries remaining today
        </span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full px-4 py-8">
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
              onClick={() => setShowHistory(!showHistory)}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Text Summarization</CardTitle>
                    <CardDescription>
                      Paste any text to get an instant summary
                      {renderUsageLimits('text')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SummarizerForm 
                      onSummarize={handleTextSummarize} 
                      setIsLoading={setIsLoading} 
                      inputType="text"
                      disabled={!isPremium && isLimitReached('text')}
                    />
                    <SummaryResult summary={summary} isLoading={isLoading} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="url">
                <Card>
                  <CardHeader>
                    <CardTitle>URL & PDF Summarization</CardTitle>
                    <CardDescription>
                      Upload a PDF or enter a URL to summarize
                      {renderUsageLimits('url')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SummarizerForm 
                      onSummarize={handleUrlSummarize} 
                      setIsLoading={setIsLoading} 
                      inputType="url"
                      placeholder="Enter URL (e.g., https://example.com/article)"
                      disabled={!isPremium && isLimitReached('url')}
                    />
                    <SummaryResult summary={summary} isLoading={isLoading} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="youtube">
                <Card>
                  <CardHeader>
                    <CardTitle>YouTube Summarization</CardTitle>
                    <CardDescription>
                      Paste a YouTube URL to summarize the video
                      {renderUsageLimits('youtube')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SummarizerForm 
                      onSummarize={handleYouTubeSummarize} 
                      setIsLoading={setIsLoading}
                      inputType="youtube"
                      placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                      disabled={!isPremium && isLimitReached('youtube')}
                    />
                    <SummaryResult summary={summary} isLoading={isLoading} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
