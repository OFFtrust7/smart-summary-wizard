
/**
 * Advanced context-aware summary generators that use entity analysis
 */

// Enhanced context-aware summary generators
export const generateContextAwareConciseSummary = (text: string, entities: string[]): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Prioritize sentences with key entities
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    
    // Position scoring (beginning and end are important)
    if (index < 2) score += 3;
    if (index >= sentences.length - 2) score += 2;
    
    // Entity scoring
    entities.forEach(entity => {
      if (sentence.includes(entity)) score += 2;
    });
    
    // Keyword scoring
    const keywords = ['important', 'key', 'main', 'primary', 'essential', 'significant', 'major'];
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 1;
    });
    
    return { sentence: sentence.trim(), score, index };
  });
  
  // Select top sentences
  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, sentences.length))
    .sort((a, b) => a.index - b.index)
    .map(item => item.sentence);
  
  const entitySection = entities.length > 0 ? `\n\n**Key Topics:** ${entities.slice(0, 5).join(', ')}` : '';
  
  return `## Concise Summary\n\n${selectedSentences.map(s => `• ${s}`).join('\n')}${entitySection}`;
};

export const generateContextAwareBalancedSummary = (text: string, entities: string[]): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Enhanced scoring for balanced summary
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    
    // Position scoring
    if (index < 3) score += 2;
    if (index >= sentences.length - 2) score += 1.5;
    
    // Length scoring (prefer medium-length sentences)
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount >= 8 && wordCount <= 25) score += 1;
    
    // Entity and keyword scoring
    entities.forEach(entity => {
      if (sentence.includes(entity)) score += 1.5;
    });
    
    const keywords = ['because', 'therefore', 'however', 'furthermore', 'analysis', 'result', 'conclusion'];
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 1;
    });
    
    return { sentence: sentence.trim(), score, index };
  });
  
  // Select sentences for different sections
  const totalSentences = Math.min(Math.ceil(sentences.length * 0.15), 8);
  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, totalSentences)
    .sort((a, b) => a.index - b.index);
  
  const introduction = selectedSentences.slice(0, Math.ceil(totalSentences / 3));
  const mainPoints = selectedSentences.slice(Math.ceil(totalSentences / 3), Math.ceil(totalSentences * 2 / 3));
  const conclusion = selectedSentences.slice(Math.ceil(totalSentences * 2 / 3));
  
  const entitySection = entities.length > 0 ? `\n\n**Key Topics:** ${entities.slice(0, 7).join(', ')}` : '';
  const actualPercentage = Math.round((selectedSentences.length / sentences.length) * 100);
  
  return `
## Balanced Summary

### Overview
${introduction.map(item => `${item.sentence}.`).join(' ')}

### Key Points
${mainPoints.map(item => `• ${item.sentence}`).join('\n')}

${conclusion.length > 0 ? `### Conclusion\n${conclusion.map(item => `${item.sentence}.`).join(' ')}` : ''}${entitySection}

---
*This intelligent summary captures approximately ${actualPercentage}% of the original content, focusing on key insights and context.*
  `;
};

export const generateContextAwareDetailedSummary = (text: string, entities: string[]): string => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Advanced scoring for detailed summary
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    
    // Position scoring
    if (index < 5) score += 2;
    if (index >= sentences.length - 3) score += 1.5;
    
    // Content quality scoring
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 30) score += 1.5;
    
    // Entity scoring
    entities.forEach(entity => {
      if (sentence.includes(entity)) score += 1;
    });
    
    // Advanced keyword scoring
    const analysisKeywords = ['analysis', 'research', 'study', 'data', 'results', 'findings'];
    const contextKeywords = ['significant', 'important', 'critical', 'essential', 'major'];
    const transitionKeywords = ['furthermore', 'moreover', 'additionally', 'however', 'therefore'];
    
    analysisKeywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 1.5;
    });
    
    contextKeywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 1;
    });
    
    transitionKeywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 0.5;
    });
    
    return { sentence: sentence.trim(), score, index };
  });
  
  // Target 15-20% of content for detailed summary
  const targetPercentage = 0.17;
  const maxSentences = Math.min(Math.ceil(sentences.length * targetPercentage), 12);
  const minSentences = Math.max(Math.ceil(sentences.length * 0.12), 6);
  
  const sentenceCount = Math.max(minSentences, Math.min(maxSentences, Math.ceil(sentences.length * targetPercentage)));
  
  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index);
  
  // Organize into structured sections
  const sectionSize = Math.ceil(selectedSentences.length / 3);
  const introduction = selectedSentences.slice(0, sectionSize);
  const analysis = selectedSentences.slice(sectionSize, sectionSize * 2);
  const insights = selectedSentences.slice(sectionSize * 2);
  
  const entitySection = entities.length > 0 ? `\n\n**Key Topics & Entities:** ${entities.join(', ')}` : '';
  const actualPercentage = Math.round((selectedSentences.length / sentences.length) * 100);
  
  return `
## Detailed Summary

### Introduction & Context
${introduction.map(item => `${item.sentence}.`).join(' ')}

### Primary Analysis
${analysis.map(item => `• ${item.sentence}`).join('\n')}

### Key Insights & Conclusions
${insights.map(item => `• ${item.sentence}`).join('\n')}${entitySection}

---
*This intelligent detailed summary captures approximately ${actualPercentage}% of the original content, preserving critical context and key insights while maintaining readability.*
  `;
};
