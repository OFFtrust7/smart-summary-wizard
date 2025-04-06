
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SummarizerForm from '@/components/SummarizerForm';
import SummaryResult from '@/components/SummaryResult';
import { useUsageLimits } from '@/contexts/UsageLimitsContext';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { env } from '@/config/env';

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
  const { toast: uiToast } = useToast();
  const type = 'youtube';
  const [validationError, setValidationError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  
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
    // More comprehensive YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[a-zA-Z0-9_-]{11}.*$/;
    return youtubeRegex.test(url);
  };
  
  const handleSummarize = (url: string) => {
    setValidationError(null);
    setProcessing(true);
    
    if (!url.trim()) {
      setValidationError("Please enter a YouTube URL");
      toast.error("Please enter a YouTube URL");
      setProcessing(false);
      return;
    }
    
    if (!isValidYoutubeUrl(url)) {
      setValidationError("Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ)");
      toast.error("Please enter a valid YouTube URL");
      setProcessing(false);
      return;
    }
    
    // Check if the feature is enabled
    if (!env.ENABLE_YOUTUBE_SUMMARIZER) {
      toast.error("YouTube summarization is currently disabled");
      setValidationError("YouTube summarization is currently disabled. Please check your backend configuration.");
      setProcessing(false);
      return;
    }
    
    if (!isPremium && isLimitReached(type)) {
      toast.error("You've reached the free limit for YouTube summaries");
      setProcessing(false);
      return;
    }
    
    // If all validations pass, call the onSummarize function
    onSummarize(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Summarization</CardTitle>
        <CardDescription>
          Paste a YouTube URL to generate a professional summary of the video content
          {renderUsageLimits()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Advanced AI Summarization</AlertTitle>
            <AlertDescription>
              Our enhanced YouTube summarizer uses AI to transcribe and summarize video content. 
              Works with standard videos, shorts, and more. For best results, use videos with clear spoken content.
            </AlertDescription>
          </Alert>
        </div>
        
        {validationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        
        <SummarizerForm 
          onSummarize={handleSummarize} 
          setIsLoading={setIsLoading}
          inputType="youtube"
          placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=... or https://youtu.be/...)"
          disabled={(!isPremium && isLimitReached(type)) || processing || isLoading}
        />
        
        {!isLoading && !summary && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <a 
                href="/BACKEND_SETUP.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary underline"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View backend setup instructions
              </a>
            </p>
          </div>
        )}
        
        <SummaryResult summary={summary} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default YouTubeSummaryTab;
