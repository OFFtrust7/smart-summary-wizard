
/**
 * Basic summary generation functions for different summary types
 */

// Enhanced mock summary generators
export const generateConciseSummary = (text: string): string => {
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

export const generateBalancedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Target 15% of content for balanced summary
  const targetPercentage = 0.15;
  const sentenceCount = Math.max(Math.ceil(sentences.length * targetPercentage), 3);
  
  // Select sentences from beginning, middle and end to provide a balanced view
  const result = [];
  
  // Add first 1-2 sentences (introduction)
  const introCount = Math.min(2, Math.ceil(sentenceCount / 3));
  result.push(...sentences.slice(0, introCount));
  
  // Add some from the middle (main content)
  if (sentenceCount > introCount && sentences.length > 4) {
    const middleStart = Math.floor(sentences.length / 3);
    const middleCount = Math.ceil((sentenceCount - introCount) / 2);
    for (let i = 0; i < middleCount && middleStart + i < sentences.length - 1; i++) {
      result.push(sentences[middleStart + i]);
    }
  }
  
  // Add the last sentence if we have enough sentences (conclusion)
  if (sentences.length > 3 && result.length < sentenceCount) {
    result.push(sentences[sentences.length - 1]);
  }
  
  const actualPercentage = Math.round((result.length / sentences.length) * 100);
  
  // Structure the summary with sections
  return `
## Balanced Summary

### Key Points:
${result.slice(0, Math.ceil(result.length / 2)).map(s => `• ${s.trim()}`).join('\n')}

### Additional Insights:
${result.slice(Math.ceil(result.length / 2)).map(s => `• ${s.trim()}`).join('\n')}

---
*This balanced summary captures approximately ${actualPercentage}% of the original content.*
  `;
};

export const generateDetailedSummary = (text: string): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Target 10-20% of content for detailed summary, aiming for 15% as the sweet spot
  const minPercentage = 0.10;
  const maxPercentage = 0.20;
  const targetPercentage = 0.15;
  
  let sentenceCount = Math.ceil(sentences.length * targetPercentage);
  
  // Ensure we stay within the 10-20% range
  const minSentences = Math.ceil(sentences.length * minPercentage);
  const maxSentences = Math.ceil(sentences.length * maxPercentage);
  
  sentenceCount = Math.max(minSentences, Math.min(maxSentences, sentenceCount));
  
  // Ensure minimum viable summary
  sentenceCount = Math.max(sentenceCount, 5);
  
  // For detailed, select key sentences throughout the text
  const result = [];
  
  // Always include first 2-3 sentences as introduction
  const introduction = sentences.slice(0, Math.min(3, sentences.length));
  result.push(...introduction);
  
  // Select sentences from throughout the text for the main content
  const remainingSentences = sentenceCount - introduction.length - 1; // Reserve 1 for conclusion
  const mainContent = [];
  
  if (remainingSentences > 0) {
    const startIndex = introduction.length;
    const endIndex = sentences.length - 1;
    const step = Math.max(1, Math.floor((endIndex - startIndex) / remainingSentences));
    
    for (let i = startIndex; i < endIndex && mainContent.length < remainingSentences; i += step) {
      mainContent.push(sentences[i]);
    }
  }
  
  // Always include the last sentence as conclusion if we have more than 3 sentences
  const conclusion = sentences.length > 3 ? [sentences[sentences.length - 1]] : [];
  
  // Combine all sections
  const finalResult = [...introduction, ...mainContent, ...conclusion];
  
  // Remove duplicates while preserving order
  const uniqueResult = finalResult.filter((sentence, index, arr) => 
    arr.findIndex(s => s.trim() === sentence.trim()) === index
  );
  
  // Group sentences into logical sections
  const introText = introduction.join('. ');
  
  // Split main content into sections
  const mainSection1 = mainContent.slice(0, Math.ceil(mainContent.length / 2));
  const mainSection2 = mainContent.slice(Math.ceil(mainContent.length / 2));
  
  const actualPercentage = Math.round((uniqueResult.length / sentences.length) * 100);
  
  // Create a markdown-formatted detailed summary
  return `
## Detailed Summary

### Introduction
${introText}

### Primary Analysis
${mainSection1.map(s => `• ${s.trim()}`).join('\n')}

### Further Considerations
${mainSection2.map(s => `• ${s.trim()}`).join('\n')}

${conclusion.length > 0 ? `### Conclusion\n${conclusion.join('. ')}` : ''}

---
*This detailed summary captures approximately ${actualPercentage}% of the original content, preserving key insights while reducing length.*
  `;
};
