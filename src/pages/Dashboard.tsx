
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowUp, FileText, Upload, Youtube } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium] = useState(false); // In a real app, this would come from auth state

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
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground mt-1">Access all your summarization tools</p>
          </div>
          <div className="flex items-center gap-2">
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
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="text">
                <FileText className="mr-2 h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="url" disabled={!isPremium}>
                <Upload className="mr-2 h-4 w-4" />
                URL / PDF
              </TabsTrigger>
              <TabsTrigger value="youtube" disabled={!isPremium}>
                <Youtube className="mr-2 h-4 w-4" />
                YouTube
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <Card>
                <CardHeader>
                  <CardTitle>Text Summarization</CardTitle>
                  <CardDescription>Paste any text to get an instant summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <SummarizerForm onSummarize={setSummary} setIsLoading={setIsLoading} />
                  <SummaryResult summary={summary} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="url">
              {isPremium ? (
                <Card>
                  <CardHeader>
                    <CardTitle>URL & PDF Summarization</CardTitle>
                    <CardDescription>Upload a PDF or enter a URL to summarize</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SummarizerForm onSummarize={setSummary} setIsLoading={setIsLoading} />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Feature</CardTitle>
                    <CardDescription>Upgrade to access URL & PDF summarization</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8">
                    <Button onClick={() => navigate('/pricing')}>
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="youtube">
              {isPremium ? (
                <Card>
                  <CardHeader>
                    <CardTitle>YouTube Summarization</CardTitle>
                    <CardDescription>Paste a YouTube URL to summarize the video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SummarizerForm onSummarize={setSummary} setIsLoading={setIsLoading} />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Feature</CardTitle>
                    <CardDescription>Upgrade to access YouTube video summarization</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8">
                    <Button onClick={() => navigate('/pricing')}>
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
