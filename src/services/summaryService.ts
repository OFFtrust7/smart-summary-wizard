
/**
 * This service is responsible for handling the summary API requests.
 * In a production environment, this would connect to a real backend.
 * For demo purposes, we're mocking the API responses.
 */

// Add API_URL when you have a real backend
// const API_URL = 'http://localhost:5000/summarize';

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
      const firstSentence = text.split('.')[0] + '.';
      
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

// Mock summary generators
const generateConciseSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = text.split(/\s+/).length;
  
  // Take first sentence and maybe one more based on text length
  const sentenceCount = wordCount > 100 ? 2 : 1;
  return sentences.slice(0, sentenceCount).join('. ') + '.';
};

const generateBalancedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = text.split(/\s+/).length;
  
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
  const wordCount = text.split(/\s+/).length;
  
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

// This would be used with a real backend API
/*
export const summarizeText = async (text: string, type: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, type }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};
*/
