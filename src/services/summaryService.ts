
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

// Enhanced mock summary generators
const generateConciseSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take first sentence and maybe one more based on text length
  const sentenceCount = sentences.length > 5 ? 3 : 2;
  
  // Create a concise but informative summary
  const selectedSentences = sentences.slice(0, sentenceCount);
  
  // Format the summary with bullet points if there are multiple sentences
  if (selectedSentences.length > 1) {
    return `## Concise Summary\n\n${selectedSentences.map(s => `• ${s.trim()}`).join('\n')}`;
  }
  
  return `## Concise Summary\n\n${selectedSentences.join('. ')}`;
};

const generateBalancedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take more sentences for a balanced summary
  const sentenceCount = Math.min(Math.ceil(sentences.length / 3), 5);
  
  // Select sentences from beginning, middle and end to provide a balanced view
  const result = [];
  
  // Add first 1-2 sentences (introduction)
  result.push(...sentences.slice(0, Math.min(2, sentenceCount)));
  
  // Add some from the middle (main content)
  if (sentenceCount > 2 && sentences.length > 4) {
    const middleStart = Math.floor(sentences.length / 3);
    for (let i = 0; i < Math.floor(sentenceCount / 2); i++) {
      if (middleStart + i < sentences.length - 1) {
        result.push(sentences[middleStart + i]);
      }
    }
  }
  
  // Add the last sentence if we have enough sentences (conclusion)
  if (sentences.length > 3 && sentenceCount > 3) {
    result.push(sentences[sentences.length - 1]);
  }
  
  // Structure the summary with sections
  return `
## Balanced Summary

### Key Points
${result.slice(0, Math.ceil(result.length / 2)).map(s => `• ${s.trim()}`).join('\n')}

### Additional Insights
${result.slice(Math.ceil(result.length / 2)).map(s => `• ${s.trim()}`).join('\n')}
  `;
};

const generateDetailedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Take more sentences for a detailed summary
  const sentenceCount = Math.min(Math.ceil(sentences.length / 2), 12);
  
  // For detailed, select key sentences throughout the text
  const result = [];
  
  // Always include first sentence as introduction
  const introduction = sentences.slice(0, Math.min(2, sentences.length));
  
  // Select sentences from throughout the text for the main content
  const mainContent = [];
  const step = Math.max(1, Math.floor((sentences.length - 3) / (sentenceCount - 3)));
  for (let i = 2; i < sentences.length - 1; i += step) {
    if (mainContent.length < sentenceCount - 3) {
      mainContent.push(sentences[i]);
    }
  }
  
  // Always include the last sentence as conclusion
  const conclusion = sentences.slice(-1);
  
  // Group sentences into logical sections
  const introText = introduction.join('. ');
  
  // Split main content into sections
  const mainSection1 = mainContent.slice(0, Math.ceil(mainContent.length / 2));
  const mainSection2 = mainContent.slice(Math.ceil(mainContent.length / 2));
  
  // Create a markdown-formatted detailed summary
  return `
## Detailed Summary

### Introduction
${introText}

### Primary Analysis
${mainSection1.map(s => `• ${s.trim()}`).join('\n')}

### Further Considerations
${mainSection2.map(s => `• ${s.trim()}`).join('\n')}

### Conclusion
${conclusion}

---
*This detailed summary captures approximately ${Math.round((sentenceCount / sentences.length) * 100)}% of the original content, preserving key insights while reducing length.*
  `;
};
