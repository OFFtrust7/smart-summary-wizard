
// Environment configuration
interface EnvConfig {
  // Backend API URL
  BACKEND_API_URL: string;
  
  // Company contact information
  COMPANY_EMAIL: string;
  COMPANY_NAME: string;
  
  // Feature flags
  ENABLE_YOUTUBE_SUMMARIZER: boolean;
  ENABLE_AI_ASSISTANT: boolean;
  
  // OpenAI configuration
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;

  // Helper methods
  isDevelopment?: () => boolean;
  isProduction?: () => boolean;
}

// Default configuration for development
const defaultConfig: EnvConfig = {
  BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001',
  COMPANY_EMAIL: import.meta.env.VITE_COMPANY_EMAIL || 'contact@snapsummary.com',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'SnapSummary',
  // Parse string 'true'/'false' to boolean - default to true if not specified
  ENABLE_YOUTUBE_SUMMARIZER: import.meta.env.VITE_ENABLE_YOUTUBE_SUMMARIZER !== 'false',
  ENABLE_AI_ASSISTANT: import.meta.env.VITE_ENABLE_AI_ASSISTANT !== 'false',
  // OpenAI configuration
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
};

// Helper to check if we're in a development environment
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

// Helper to check if we're in a production environment
export const isProduction = (): boolean => {
  return import.meta.env.PROD || import.meta.env.MODE === 'production';
};

// Export the environment configuration
export const env: EnvConfig = {
  ...defaultConfig,
  // Override with any environment-specific settings here
  isDevelopment,
  isProduction
};
