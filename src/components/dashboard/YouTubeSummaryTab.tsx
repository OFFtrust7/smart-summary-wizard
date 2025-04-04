
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface YouTubeSummaryTabProps {
  summary: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSummarize: (youtubeUrl: string) => void;
  isPremium: boolean;
}

const YouTubeSummaryTab: React.FC<YouTubeSummaryTabProps> = ({ 
  summary, 
  isLoading, 
  setIsLoading, 
  onSummarize,
  isPremium
}) => {
  const { isLimitReached, remainingUsage, getLimits } = useUsageLimits();
  const type = 'youtube';
  
  const renderUsageLimits = () => {
    if (isPremium) return null;
    
    return (
      <div className="mt-2 text-sm">
        <span className={isLimitReached(type) ? "text-destructive" : "text-muted-foreground"}>
          {remainingUsage(type)} of {getLimits()[type]} free {type} summaries remaining today
        </span>
      </div>
    );
  };

  const isValidYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}.*$/;
    return youtubeRegex.test(url);
  };
  
  const handleSummarize = (url: string) => {
    if (!isValidYoutubeUrl(url)) {
      alert("Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ)");
      return;
    }
    onSummarize(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Summarization</CardTitle>
        <CardDescription>
          Paste a YouTube URL to summarize the video content
          {renderUsageLimits()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tips for best results</AlertTitle>
            <AlertDescription>
              For best results, use videos with clear spoken content. The summarizer works best with educational videos, 
              presentations, and talks rather than music videos or action-heavy content.
            </AlertDescription>
          </Alert>
        </div>
        
        <SummarizerForm 
          onSummarize={handleSummarize} 
          setIsLoading={setIsLoading}
          inputType="youtube"
          placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
          disabled={!isPremium && isLimitReached(type)}
        />
        <SummaryResult summary={summary} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default YouTubeSummaryTab;
