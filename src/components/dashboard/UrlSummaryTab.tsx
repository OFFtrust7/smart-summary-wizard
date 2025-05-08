
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';

interface UrlSummaryTabProps {
  summary: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSummarize: (url: string) => void;
  isPremium: boolean;
}

const UrlSummaryTab: React.FC<UrlSummaryTabProps> = ({ 
  summary, 
  isLoading, 
  setIsLoading, 
  onSummarize,
  isPremium
}) => {
  const { isLimitReached, remainingUsage, getLimits } = useUsageLimits();
  const type = 'url';
  
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
        <CardTitle>URL & Document Summarization</CardTitle>
        <CardDescription>
          Upload a document (PDF, TXT) or enter a URL to summarize
          {renderUsageLimits()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SummarizerForm 
          onSummarize={onSummarize} 
          setIsLoading={setIsLoading} 
          inputType="url"
          placeholder="Enter URL or upload document"
          disabled={!isPremium && isLimitReached(type)}
        />
        <SummaryResult summary={summary} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default UrlSummaryTab;
