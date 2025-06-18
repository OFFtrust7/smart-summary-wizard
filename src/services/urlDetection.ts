
/**
 * URL detection utilities for different content types
 */

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
