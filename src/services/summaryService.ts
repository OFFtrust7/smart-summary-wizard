
/**
 * This service is responsible for handling the summary API requests.
 * In a production environment, this would connect to a real backend.
 * For demo purposes, we're mocking the API responses.
 */

// Mock summarization function that returns a promise
export const summarizeText = async (text: string, type: string): Promise<string> => {
  // For demo purposes, simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock summary based on the input length and type
      const wordCount = text.split(/\s+/).length;
      
      if (wordCount < 10) {
        resolve("Please provide more text for an accurate summary.");
        return;
      }
      
      // Create a summary based on type
      let summary = '';
      
      if (type === 'concise') {
        summary = generateConciseSummary(text);
      } else if (type === 'balanced') {
        summary = generateBalancedSummary(text);
      } else {
        summary = generateDetailedSummary(text);
      }
      
      resolve(summary);
    }, 1500); // Simulate network delay
  });
};

// Function to detect if the input is a URL
export const isUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

// Function to detect if the input is a YouTube URL
export const isYouTubeUrl = (text: string): boolean => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(text);
};

// Mock URL summarization (in a real app, this would fetch the content of the URL and summarize it)
export const summarizeUrl = async (url: string, type: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock summary for the URL
      resolve(`This is a summary of the content found at ${url}. The page discusses various topics related to its domain. The main points include information about the organization, its services, and how they benefit users. Some key insights from the article include data about industry trends and future projections. The article concludes with recommendations for readers.`);
    }, 2000);
  });
};

// Mock YouTube summarization (in a real app, this would extract the transcript and summarize it)
export const summarizeYouTube = async (url: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extract video ID for a more realistic response
      let videoId = '';
      try {
        if (url.includes('youtu.be')) {
          videoId = url.split('/').pop() || '';
        } else if (url.includes('youtube.com')) {
          const urlParams = new URLSearchParams(new URL(url).search);
          videoId = urlParams.get('v') || '';
        }
      } catch (error) {
        videoId = 'unknown';
      }
      
      // Generate a mock summary for the YouTube video
      resolve(`Summary of YouTube video (${videoId}): This video discusses important topics related to its subject matter. The presenter begins by introducing the main concepts and then elaborates on each point with examples and demonstrations. Key takeaways include practical advice on implementation and best practices. The video concludes with a summary of the main points and suggestions for further learning resources.`);
    }, 2500);
  });
};

// Mock summary generators
const generateConciseSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take first sentence and maybe one more based on text length
  const sentenceCount = sentences.length > 5 ? 2 : 1;
  return sentences.slice(0, sentenceCount).join('. ') + '.';
};

const generateBalancedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take more sentences for a balanced summary
  const sentenceCount = Math.min(Math.ceil(sentences.length / 3), 5);
  
  // Select sentences from beginning, middle and end
  const result = [];
  result.push(sentences[0]); // First sentence
  
  if (sentenceCount > 1) {
    // Add some from the middle
    const middleStart = Math.floor(sentences.length / 3);
    for (let i = 0; i < Math.floor(sentenceCount / 2); i++) {
      if (middleStart + i < sentences.length) {
        result.push(sentences[middleStart + i]);
      }
    }
    
    // Add the last sentence if we have enough sentences
    if (sentences.length > 2 && sentenceCount > 2) {
      result.push(sentences[sentences.length - 1]);
    }
  }
  
  return result.join('. ') + '.';
};

const generateDetailedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take more sentences for a detailed summary
  const sentenceCount = Math.min(Math.ceil(sentences.length / 2), 10);
  
  // For detailed, take evenly distributed sentences
  const result = [];
  result.push(sentences[0]); // Always include first sentence
  
  if (sentenceCount > 1) {
    const step = Math.floor(sentences.length / (sentenceCount - 1));
    for (let i = 1; i < sentenceCount - 1; i++) {
      const index = Math.min(i * step, sentences.length - 1);
      result.push(sentences[index]);
    }
    
    // Add the last sentence
    if (sentences.length > 1) {
      result.push(sentences[sentences.length - 1]);
    }
  }
  
  return result.join('. ') + '.';
};
