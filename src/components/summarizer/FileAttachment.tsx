
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
            toast.info(`Processing PDF: ${file.name}`);
            // For PDFs, we can only extract limited content with readAsArrayBuffer
            // A proper PDF parser would be needed for production use
            const arrayBuffer = await readFileAsArrayBuffer(file);
            // Just notify user about PDF attachment, actual parsing needs backend
            toast.info("PDF attached. Full PDF parsing requires backend processing.");
            // Pass a placeholder for PDF content
            onFileContent(`[PDF Document: ${file.name}]`, file.name);
          } 
          else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            try {
              toast.info(`Reading file: ${file.name}`);
              // For text files, use readAsText with UTF-8 encoding specified
              const text = await readFileAsText(file);
              // Clean up any non-printable characters
              const cleanedText = cleanTextContent(text);
              onFileContent(cleanedText, file.name);
              toast.success(`Text content from "${file.name}" loaded`);
            } catch (error) {
              console.error("Error reading text file:", error);
              toast.error("Could not read text content. File may be corrupted or in an unsupported format.");
            }
          }
          else if (file.type.startsWith('image/')) {
            toast.info(`Attached image: ${file.name}`);
            // Image processing would be handled by the backend
            onFileContent(`[Image: ${file.name}]`, file.name);
            toast.info("Image content will need OCR processing by the service");
          }
          else {
            toast.info(`Attached file: ${file.name}`);
            onFileContent(`[File: ${file.name}]`, file.name);
          }
        } catch (error) {
          console.error('File processing error:', error);
          toast.error('Failed to process file content');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };
  
  // Helper function to clean text content
  const cleanTextContent = (text: string): string => {
    // Remove any non-printable characters except line breaks and spaces
    return text.replace(/[^\x20-\x7E\n\r\t]/g, '')
      // Remove any repeated line breaks
      .replace(/(\r?\n){3,}/g, '\n\n')
      // Ensure consistent line breaks
      .replace(/\r\n/g, '\n')
      // Replace any remaining non-ASCII characters
      .replace(/[^\x00-\x7F]/g, '');
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
      reader.readAsText(file, 'UTF-8'); // Explicitly specify UTF-8 encoding
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
      return <File className="h-5 w-5" />; // Using regular File icon instead of FilePdf
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
