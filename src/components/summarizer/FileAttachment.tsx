
import React, { useState } from 'react';
import { Upload, File, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileAttachmentProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  onFileSelect,
  acceptedTypes = "image/*,application/pdf",
  multiple = true,
  maxSize = 10, // 10MB default
  disabled = false
}) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      const newAttachments = [...attachments, ...validFiles];
      setAttachments(newAttachments);
      onFileSelect(newAttachments);
    }
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
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-5 w-5" />;
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
        disabled={disabled}
      />
      
      <Button 
        type="button"
        variant="outline" 
        className="w-full mb-2 border-dashed"
        onClick={triggerFileInput}
        disabled={disabled}
      >
        <Upload className="mr-2 h-4 w-4" />
        Attach Files or Images
      </Button>
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-background border rounded-md px-2 py-1 text-sm"
            >
              {getFileIcon(file.type)}
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => removeFile(index)}
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
