
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
            // For PDFs, we'll use text extraction in the backend
            // but we'll still read the file to send to the service
            const fileContent = await readFileAsText(file);
            onFileContent(fileContent, file.name);
          } 
          else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            const text = await readFileAsText(file);
            onFileContent(text, file.name);
          }
          else if (file.type.startsWith('image/')) {
            toast.info(`Attached image: ${file.name}`);
            // Image processing would be handled by the backend
            // For now, just notify user that images aren't directly summarized
            toast.info("Image content will need OCR processing by the service");
          }
          else {
            toast.info(`Attached file: ${file.name}`);
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
      reader.onerror = (e) => reject(new Error('File reading error'));
      reader.readAsText(file);
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
