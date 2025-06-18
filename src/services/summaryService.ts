
/**
 * This service is responsible for handling the summary API requests.
 * In a production environment, this would connect to a real backend.
 * For demo purposes, we're mocking the API responses.
 */

import { preprocessContent, extractKeyEntities, chunkLargeContent } from '@/utils/contentProcessor';
import { isUrl, isYouTubeUrl } from './urlDetection';
import { generateConciseSummary, generateBalancedSummary, generateDetailedSummary } from './summaryGenerators';
import { 
  generateContextAwareConciseSummary, 
  generateContextAwareBalancedSummary, 
  generateContextAwareDetailedSummary 
} from './contextAwareSummaryGenerators';

// Mock summarization function that returns a promise
export const summarizeText = async (text: string, type: string): Promise<string> => {
  // For demo purposes, simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Preprocess content for better analysis
      const processedText = preprocessContent(text);
      const wordCount = processedText.split(/\s+/).length;
      
      if (wordCount < 10) {
        resolve("Please provide more text for an accurate summary.");
        return;
      }
      
      // Extract key entities for context
      const keyEntities = extractKeyEntities(processedText);
      console.log('Key entities found:', keyEntities);
      
      // Handle large content by chunking if necessary
      const chunks = chunkLargeContent(processedText, 3000);
      console.log(`Content processed into ${chunks.length} chunks`);
      
      // Generate context-aware summary
      let summary = '';
      
      if (type === 'concise') {
        summary = generateContextAwareConciseSummary(processedText, keyEntities);
      } else if (type === 'balanced') {
        summary = generateContextAwareBalancedSummary(processedText, keyEntities);
      } else {
        summary = generateContextAwareDetailedSummary(processedText, keyEntities);
      }
      
      resolve(summary);
    }, 1500); // Simulate network delay
  });
};

// Mock URL summarization (in a real app, this would fetch the content of the URL and summarize it)
export const summarizeUrl = async (url: string, type: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a more detailed mock summary for the URL
      resolve(`
## Website Summary

The webpage at ${url} provides extensive information about its subject matter, presenting a comprehensive analysis with supporting data and expert opinions.

### Main Points:
1. The site explores the evolution and current state of its core topic, backed by industry research and statistical evidence.
2. It discusses various methodologies and approaches, comparing their effectiveness across different contexts.
3. Several case studies are presented, showcasing real-world applications and outcomes.
4. Expert commentary provides valuable insights into emerging trends and future developments.

### Key Findings:
- Recent data indicates significant growth in adoption rates among key demographic groups.
- Implementation challenges are addressed through a series of recommended best practices.
- Comparative analysis reveals important differentiators between various approaches.
- Long-term projections suggest continued expansion and innovation in this field.

### Conclusion:
The resource offers valuable guidance for practitioners, researchers, and decision-makers, with actionable recommendations for implementation and further exploration.
      `);
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
      
      // Generate a more comprehensive mock summary for the YouTube video
      resolve(`
## Video Summary: ${videoId}

### Introduction (0:00-2:15)
The presenter begins with an overview of the topic, establishing its relevance and importance in today's context. Key statistics are shared to highlight the significance of the subject matter.

### Main Concepts (2:16-8:45)
The video systematically explores the fundamental principles, using clear visuals and practical examples to illustrate complex ideas. The presenter breaks down technical concepts into accessible explanations.

### Demonstration (8:46-15:30)
A step-by-step demonstration showcases practical applications, with the presenter addressing common challenges and providing solutions. This section includes screen recordings and live examples.

### Expert Insights (15:31-20:15)
Guest experts share additional perspectives, offering industry experience and specialized knowledge that enhances the main content.

### Best Practices (20:16-27:40)
The video provides detailed recommendations for implementation, with specific guidelines for different scenarios and use cases. The presenter emphasizes critical success factors.

### Conclusion & Resources (27:41-30:00)
The content concludes with a summary of key takeaways and directs viewers to additional learning materials, including downloadable resources and related videos.

### Key Takeaways:
1. Implement the demonstrated techniques gradually, starting with the foundational elements.
2. Regular practice and experimentation are essential for mastering these concepts.
3. The community forum mentioned provides ongoing support for implementation challenges.
4. Updated resources are available through the link in the video description.
      `);
    }, 2500);
  });
};

// Export URL detection functions for backward compatibility
export { isUrl, isYouTubeUrl };
