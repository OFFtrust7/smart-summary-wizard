
// Environment configuration
interface EnvConfig {
  // Backend API URL
  BACKEND_API_URL: string;
  
  // Company contact information
  COMPANY_EMAIL: string;
  COMPANY_NAME: string;
  
  // Feature flags
  ENABLE_YOUTUBE_SUMMARIZER: boolean;
}

// Default configuration for development
const defaultConfig: EnvConfig = {
  BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000',
  COMPANY_EMAIL: import.meta.env.VITE_COMPANY_EMAIL || 'contact@snapsummary.com',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'SnapSummary',
  ENABLE_YOUTUBE_SUMMARIZER: true,
};

// Export the environment configuration
export const env: EnvConfig = {
  ...defaultConfig,
  // Override with any environment-specific settings here
};

// Helper to check if we're in a development environment
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

// Helper to check if we're in a production environment
export const isProduction = (): boolean => {
  return import.meta.env.PROD || import.meta.env.MODE === 'production';
};
