
import { SummaryLength } from '@/hooks/useSummarizerForm';

/**
 * Advanced content preprocessing utilities for better AI analysis
 */

export function preprocessContent(text: string): string {
  console.log('Starting content preprocessing...');
  
  // Step 1: Normalize whitespace and remove excessive line breaks
  let processed = text
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
    .replace(/[ \t]+/g, ' ')  // Normalize spaces and tabs
    .trim();

  // Step 2: Remove or clean formatting artifacts
  processed = processed
    .replace(/[^\w\s.,!?;:()\-"'\n]/g, ' ')  // Remove special chars but keep punctuation
    .replace(/\s+/g, ' ')  // Clean up multiple spaces
    .replace(/\n\s*\n/g, '\n\n');  // Clean paragraph breaks

  // Step 3: Preserve document structure by identifying key sections
  processed = preserveDocumentStructure(processed);

  // Step 4: Clean up encoding issues
  processed = processed
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"');

  console.log('Content preprocessing completed:', {
    originalLength: text.length,
    processedLength: processed.length,
    reduction: `${Math.round((1 - processed.length / text.length) * 100)}%`
  });

  return processed.trim();
}

export function preserveDocumentStructure(text: string): string {
  // Identify and preserve headings, bullet points, and key structural elements
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    
    // Preserve headings (lines that look like headings)
    if (trimmed.length > 0 && trimmed.length < 100 && 
        (trimmed.match(/^[A-Z][^.!?]*$/) || 
         trimmed.includes(':') && trimmed.length < 50)) {
      return `\n${trimmed}\n`;
    }
    
    // Preserve bullet points and numbered lists
    if (trimmed.match(/^[\-\*\+]\s/) || trimmed.match(/^\d+\.\s/)) {
      return trimmed;
    }
    
    return trimmed;
  });

  return processedLines.join('\n').replace(/\n{3,}/g, '\n\n');
}

export function suggestSummaryLength(text: string): SummaryLength {
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const complexity = calculateComplexity(text);
  
  console.log('Content analysis:', { wordCount, sentenceCount, complexity });
  
  // Smart length suggestion based on content characteristics
  if (wordCount < 200 || sentenceCount < 5) {
    return 'concise';  // Short content needs concise summary
  } else if (wordCount > 1000 || complexity > 0.7 || sentenceCount > 20) {
    return 'detailed';  // Long or complex content benefits from detailed summary
  } else {
    return 'balanced';  // Medium content works well with balanced summary
  }
}

function calculateComplexity(text: string): number {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return 0;
  
  // Average words per sentence (higher = more complex)
  const avgWordsPerSentence = words.length / sentences.length;
  
  // Average word length (longer words = more complex)
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  // Technical terms indicator (words with 7+ characters)
  const technicalWords = words.filter(word => word.length >= 7).length;
  const technicalRatio = technicalWords / words.length;
  
  // Combine factors (normalized to 0-1 scale)
  const sentenceComplexity = Math.min(avgWordsPerSentence / 20, 1);
  const wordComplexity = Math.min(avgWordLength / 8, 1);
  const technicalComplexity = Math.min(technicalRatio * 2, 1);
  
  return (sentenceComplexity + wordComplexity + technicalComplexity) / 3;
}

export function extractKeyEntities(text: string): string[] {
  // Simple entity extraction - in a real implementation, you'd use NLP libraries
  const entities: string[] = [];
  
  // Extract capitalized words that might be names, places, organizations
  const words = text.split(/\s+/);
  const capitalizedWords = words.filter(word => 
    word.length > 2 && 
    word[0] === word[0].toUpperCase() && 
    word.slice(1) === word.slice(1).toLowerCase() &&
    !['The', 'This', 'That', 'With', 'When', 'Where', 'What', 'How'].includes(word)
  );
  
  // Remove duplicates and return
  return [...new Set(capitalizedWords)].slice(0, 10);
}

export function chunkLargeContent(text: string, maxChunkSize: number = 2000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim() + '.';
    
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
    } else {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}
