
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Summarization</CardTitle>
        <CardDescription>
          Paste a YouTube URL to summarize the video
          {renderUsageLimits()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SummarizerForm 
          onSummarize={onSummarize} 
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
