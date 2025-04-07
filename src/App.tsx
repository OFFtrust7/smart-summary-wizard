
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import { UsageLimitsProvider } from "./contexts/UsageLimitsContext";
import { env } from "./config/env";
import { configureYouTubeService } from "./services/youtubeService";
import { configureAIAssistantService } from "./services/aiAssistantService";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  // Set document title and configure services
  useEffect(() => {
    document.title = "SnapSummary - AI-powered Text Summarization";
    
    // Initialize the YouTube service with the backend API URL
    if (env.ENABLE_YOUTUBE_SUMMARIZER) {
      configureYouTubeService(env.BACKEND_API_URL);
      console.log("YouTube summarizer enabled");
    } else {
      console.log("YouTube summarizer disabled");
    }
    
    // Initialize the AI Assistant service
    if (env.ENABLE_AI_ASSISTANT) {
      // Even if BACKEND_API_URL is empty, the service will fall back to mock responses
      configureAIAssistantService(env.BACKEND_API_URL);
      console.log("AI Assistant service initialized" + (env.isDevelopment() ? " (using mock responses in dev mode)" : ""));
    } else {
      console.log("AI Assistant service disabled");
    }
    
    // Log company contact information for verification
    console.log(`Contact: ${env.COMPANY_EMAIL}`);
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UsageLimitsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payment-success" element={<Dashboard />} />
                <Route path="/payment-canceled" element={<Pricing />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UsageLimitsProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
