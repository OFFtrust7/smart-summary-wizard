
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';

interface TextSummaryTabProps {
  summary: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSummarize: (text: string) => void;
  isPremium: boolean;
}

const TextSummaryTab: React.FC<TextSummaryTabProps> = ({ 
  summary, 
  isLoading, 
  setIsLoading, 
  onSummarize,
  isPremium
}) => {
  const { isLimitReached, remainingUsage, getLimits } = useUsageLimits();
  const type = 'text';
  
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
        <CardTitle>Text Summarization</CardTitle>
        <CardDescription>
          Paste any text to get an instant summary
          {renderUsageLimits()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SummarizerForm 
          onSummarize={onSummarize} 
          setIsLoading={setIsLoading} 
          inputType="text"
          disabled={!isPremium && isLimitReached(type)}
        />
        <SummaryResult summary={summary} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default TextSummaryTab;
