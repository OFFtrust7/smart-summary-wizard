import React, { useState } from 'react';
import { Upload, File, X, FileImage, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileAttachmentProps {
  onFileSelect: (files: File[]) => void;
  onFileContent?: (content: string, fileName: string) => void;
  acceptedTypes?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  onFileSelect,
  onFileContent,
  acceptedTypes = "image/*,application/pdf,.txt,.doc,.docx",
  multiple = false,
  maxSize = 10, // 10MB default
  disabled = false
}) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      const newAttachments = [...attachments, ...validFiles];
      setAttachments(newAttachments);
      onFileSelect(newAttachments);
      
      // Process file content if handler exists
      if (onFileContent && validFiles.length > 0) {
        try {
          setIsProcessing(true);
          const file = validFiles[0]; // Process the first valid file
          
          if (file.type === 'application/pdf') {
            toast.info(`Processing PDF: ${file.name}...`);
            // For PDFs, try to extract text content
            const pdfText = await extractPDFText(file);
            if (pdfText && pdfText.trim().length > 0) {
              const cleanText = cleanTextContent(pdfText);
              onFileContent(cleanText, file.name);
              toast.success(`PDF content extracted: ${file.name}`);
            } else {
              // Fallback: read as text if PDF extraction fails
              try {
                const fallbackText = await readFileAsText(file);
                const cleanText = cleanTextContent(fallbackText);
                onFileContent(cleanText, file.name);
                toast.success(`File content loaded: ${file.name}`);
              } catch (error) {
                console.error('Failed to read PDF as text:', error);
                const fallbackContent = `Please copy and paste the content from your PDF file "${file.name}" manually into the text box for summarization.`;
                onFileContent(fallbackContent, file.name);
                toast.warning(`Could not extract text from PDF. Please copy-paste content manually.`);
              }
            }
          } 
          else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            toast.info(`Reading text file: ${file.name}...`);
            const text = await readFileAsText(file);
            const cleanText = cleanTextContent(text);
            onFileContent(cleanText, file.name);
            toast.success(`Text file loaded: ${file.name}`);
          }
          else if (file.type.startsWith('image/')) {
            toast.info(`Processing image: ${file.name}...`);
            // For images, we can't extract text without OCR service
            const imageContent = `Please describe the content of the image "${file.name}" or use an OCR tool to extract text from it, then paste that text here for summarization.`;
            onFileContent(imageContent, file.name);
            toast.warning(`Image attached. Please describe content or extract text manually.`);
          }
          else {
            toast.info(`Processing file: ${file.name}...`);
            // Try to read other file types as text
            try {
              const fileText = await readFileAsText(file);
              const cleanText = cleanTextContent(fileText);
              onFileContent(cleanText, file.name);
              toast.success(`File content loaded: ${file.name}`);
            } catch (error) {
              console.error('Failed to read file as text:', error);
              const fallbackContent = `Could not read content from "${file.name}". Please copy and paste the content manually into the text box.`;
              onFileContent(fallbackContent, file.name);
              toast.warning(`Could not read file content. Please copy-paste manually.`);
            }
          }
        } catch (error) {
          console.error('File processing error:', error);
          toast.error('Failed to process file content');
          const errorContent = `Error processing "${file.name}". Please copy and paste the content manually.`;
          onFileContent(errorContent, file.name);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };
  
  // Enhanced PDF text extraction function
  const extractPDFText = async (file: File): Promise<string> => {
    try {
      // First, try to read as ArrayBuffer and look for text content
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const uint8Array = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder('utf-8');
      
      // Convert to string and try to extract readable text
      let text = textDecoder.decode(uint8Array);
      
      // Simple PDF text extraction - look for readable content between stream objects
      const textMatches = text.match(/stream\s*\n([\s\S]*?)\s*endstream/g);
      if (textMatches) {
        let extractedText = '';
        textMatches.forEach(match => {
          // Remove stream markers and try to extract readable text
          const content = match.replace(/stream\s*\n|endstream/g, '');
          // Look for readable ASCII text
          const readableText = content.match(/[a-zA-Z0-9\s.,!?;:()'"@#$%^&*\-+={}[\]|\\<>\/~`]+/g);
          if (readableText) {
            extractedText += readableText.join(' ') + ' ';
          }
        });
        
        if (extractedText.trim().length > 50) { // Only return if we found substantial text
          return cleanTextContent(extractedText);
        }
      }
      
      // Fallback: try to read as plain text
      const plainText = await readFileAsText(file);
      return cleanTextContent(plainText);
      
    } catch (error) {
      console.error('PDF extraction failed:', error);
      // Last resort: try reading as plain text
      try {
        const plainText = await readFileAsText(file);
        return cleanTextContent(plainText);
      } catch (textError) {
        console.error('Text fallback failed:', textError);
        throw new Error('Could not extract text from PDF');
      }
    }
  };
  
  // Helper function to clean text content and ensure it's plain text
  const cleanTextContent = (text: string): string => {
    // Remove any HTML tags that might be present
    let cleanText = text.replace(/<[^>]*>/g, '');
    
    // Remove control characters but keep basic formatting
    cleanText = cleanText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Remove repeated whitespace but preserve line breaks
    cleanText = cleanText.replace(/[ \t]+/g, ' ');
    cleanText = cleanText.replace(/(\r?\n){3,}/g, '\n\n');
    
    // Ensure consistent line breaks
    cleanText = cleanText.replace(/\r\n/g, '\n');
    
    // Decode common HTML entities if any present
    cleanText = cleanText.replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#039;/g, "'")
                         .replace(/&nbsp;/g, ' ');
    
    // Remove excessive whitespace at start/end
    cleanText = cleanText.trim();
    
    return cleanText;
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result.toString());
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file, 'UTF-8');
    });
  };
  
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsArrayBuffer(file);
    });
  };
  
  const removeFile = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    onFileSelect(newAttachments);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const getFileIcon = (fileType: string, fileName: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-5 w-5" />;
    }
    if (fileType === 'application/pdf') {
      return <File className="h-5 w-5" />;
    }
    if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        multiple={multiple}
        className="hidden"
        disabled={disabled || isProcessing}
      />
      
      <Button 
        type="button"
        variant="outline" 
        className="w-full mb-2 border-dashed"
        onClick={triggerFileInput}
        disabled={disabled || isProcessing}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isProcessing ? 'Processing...' : 'Attach Files or Images'}
      </Button>
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-background border rounded-md px-2 py-1 text-sm"
            >
              {getFileIcon(file.type, file.name)}
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => removeFile(index)}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
